import type { NarrativeFlags } from '~/types/narrative'
import type { NarrativePlanStep, NarrativeTaskKey, RecordFlowNode, RecordStepKey } from '~/types/record'
import { useChatApi } from '~/composables/useChatApi'
import { DEFAULT_ORDER, RECORD_STEP_META, getStepSignatures } from '~/utils/recordContent'

// 顺序结构与快照结构变更后提升版本号，使旧的本地设定失效并重新应用默认值
const VERSION = '2026-11-06a'

// 每个主项在叙事医学中对应的子任务，顺序为原有的子步骤执行顺序
const NARRATIVE_TASKS: Partial<Record<RecordStepKey, NarrativeTaskKey[]>> = {
  case: ['case'],
  story: ['story', 'conversation', 'discussion', 'comment'],
  image: ['avatar', 'illustration'],
}

function isValidOrder(next: unknown): next is RecordStepKey[] {
  return (
    Array.isArray(next) &&
    next.length === DEFAULT_ORDER.length &&
    DEFAULT_ORDER.every((key) => (next as string[]).includes(key))
  )
}

function isGenerating(status: string): boolean {
  return status === 'streaming' || status === 'submitted'
}

export const useRecordStore = defineStore('record', () => {
  const version = ref(VERSION)
  syncStoreVersion(VERSION, 'pinia:record')

  const id = ref(0)

  // 全局唯一的生成顺序，八个页面共享并持久化
  const order = ref<RecordStepKey[]>([...DEFAULT_ORDER])

  // 各节点「最近一次内容稳定变化」时记录的全体内容签名，用于判断上游是否已改变
  const snapshots = ref<Partial<Record<RecordStepKey, Record<string, string>>>>({})

  // 核心数据源
  const caseStore = useCaseStore()
  const storyStore = useStoryStore()
  const testStore = useTestStore()
  const actStore = useActStore()
  const rateStore = useRateStore()
  const imageStore = useImageStore()
  const audioStore = useAudioStore()
  const videoStore = useVideoStore()

  // case / story 共用一个单例 Chat，其余场景各自独立，需分别读取完成状态
  const chatApi = useChatApi()

  const signatures = computed(() => getStepSignatures())

  // 已有内容的节点，若当前顺序中位于其前的任一节点内容发生变化，则提示需要重新生成
  const needsRegenerate = computed<Record<RecordStepKey, boolean>>(() => {
    const sig = signatures.value
    const result = {} as Record<RecordStepKey, boolean>
    for (const key of DEFAULT_ORDER) {
      if (!sig[key]) {
        result[key] = false
        continue
      }
      const base = snapshots.value[key] ?? sig
      const index = order.value.indexOf(key)
      result[key] = DEFAULT_ORDER.some((other) => {
        if (other === key) return false
        return order.value.indexOf(other) < index && (base[other] ?? '') !== (sig[other] ?? '')
      })
    }
    return result
  })

  const generating = computed<Record<RecordStepKey, boolean>>(() => {
    const chatStatus = chatApi.status.value
    const currentType = chatApi.currentType.value ?? ''
    return {
      case: isGenerating(chatStatus) && currentType.startsWith('case'),
      story: isGenerating(chatStatus) && currentType.startsWith('story'),
      test: isGenerating(testStore.status),
      // 互动实践的 Chat 实例位于组件内部，无可靠的全局生成状态，统一按未生成中处理
      act: false,
      rate: isGenerating(rateStore.status),
      image: isGenerating(imageStore.status),
      video: isGenerating(videoStore.status),
      audio: isGenerating(audioStore.status),
    }
  })

  const nodes = computed<RecordFlowNode[]>(() =>
    order.value.map((key, index) => ({
      ...RECORD_STEP_META[key],
      index,
      hasContent: !!signatures.value[key],
      isGenerating: generating.value[key],
      needsRegenerate: needsRegenerate.value[key],
    })),
  )

  // 首次进入时为已有内容建立基准快照，避免历史数据造成满屏「需重新生成」误报
  if (import.meta.client) {
    const sig = signatures.value
    for (const key of DEFAULT_ORDER) {
      if (!snapshots.value[key] && sig[key]) {
        snapshots.value[key] = { ...sig }
      }
    }
  }

  // 内容稳定变化后刷新该节点快照；约 200ms 防抖避开流式中间态与自动校验/修正链
  const pending = new Set<RecordStepKey>()
  let timer: ReturnType<typeof setTimeout> | null = null
  watch(
    signatures,
    (next, prev) => {
      if (!import.meta.client) return
      const changed = prev
        ? DEFAULT_ORDER.filter((key) => prev[key] !== next[key])
        : DEFAULT_ORDER.filter((key) => next[key])
      if (!changed.length) return
      for (const key of changed) pending.add(key)
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => {
        const sig = signatures.value
        for (const key of pending) {
          if (sig[key]) snapshots.value[key] = { ...sig }
          else delete snapshots.value[key]
        }
        pending.clear()
        timer = null
      }, 200)
    },
    { immediate: true },
  )

  function setOrder(next: RecordStepKey[]) {
    if (!isValidOrder(next)) return
    order.value = [...next]
  }

  function moveStep(key: RecordStepKey, delta: number) {
    const from = order.value.indexOf(key)
    const to = from + delta
    if (from < 0 || to < 0 || to >= order.value.length) return
    const next = [...order.value]
    next.splice(from, 1)
    next.splice(to, 0, key)
    order.value = next
  }

  function restoreDefaultOrder() {
    order.value = [...DEFAULT_ORDER]
  }

  // 叙事医学按当前顺序执行已开启的主项，子任务就近跟随所属主项
  function getNarrativePlan(flags: NarrativeFlags): NarrativePlanStep[] {
    const plan: NarrativePlanStep[] = []
    for (const step of order.value) {
      const tasks = (NARRATIVE_TASKS[step] ?? []).filter((task) => flags[task])
      if (tasks.length) plan.push({ step, tasks })
    }
    return plan
  }

  // clearInputs 供「清空记录」使用：连同用户录入的自定义要点、病历教科书设定一起清掉。
  // 叙事医学单页的全量重置依赖这些设定继续生成，因此默认不清。
  function reset(options: { clearInputs?: boolean } = {}) {
    id.value = 0
    snapshots.value = {}
    caseStore.reset()
    storyStore.reset()
    testStore.reset()
    actStore.reset()
    rateStore.reset()
    imageStore.reset()
    audioStore.reset()
    videoStore.reset()
    if (options.clearInputs) useStateStore().resetInputs()
  }

  return {
    version,
    id,
    order,
    snapshots,
    nodes,
    setOrder,
    moveStep,
    restoreDefaultOrder,
    getNarrativePlan,
    reset,
  }
})
