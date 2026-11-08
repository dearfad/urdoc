import type { NarrativeFlags } from '~/types/narrative'
import type { NarrativeTaskKey } from '~/types/record'

export interface NarrativeGeneratorDeps {
  getDisease: () => string
  getGeneratePlan: () => NarrativeFlags
  onEmptyPlan: () => void
}

// 叙事医学的生成编排：按 record 的设定顺序串行执行主项及其子任务。
// useChatApi 是模块级单例，抽到 composable 后多次调用不会新建 Chat 或丢失状态。
export function useNarrativeGenerator(deps: NarrativeGeneratorDeps) {
  const caseStore = useCaseStore()
  const stateStore = useStateStore()
  const imageStore = useImageStore()
  const storyStore = useStoryStore()
  const recordStore = useRecordStore()
  const chatApi = useChatApi()

  // 患者头像是否正在生成（置于生成序列最后，同步等待完成）
  const isAvatarGenerating = ref(false)
  // 故事插图是否正在生成（以头像为参考，紧接头像之后生成）
  const isIllustrationGenerating = ref(false)

  // 生成状态：覆盖「生成叙事」全流程（病例 → 故事 → 对话 → 讨论 → 点评）
  const NARRATIVE_TYPES = [
    'case',
    'case-verify',
    'case-fix',
    'story',
    'story-verify',
    'story-fix',
    'story-conversation',
    'story-discussion',
    'story-comment',
  ]
  const isGenerating = computed(
    () =>
      (chatApi.status.value === 'submitted' || chatApi.status.value === 'streaming') &&
      NARRATIVE_TYPES.includes(chatApi.currentType.value ?? ''),
  )

  // 当前正在生成的区块（用于在对应卡片内显示「生成中」提示）
  const generatingSection = computed(() => (isGenerating.value ? (chatApi.currentType.value as string) : null))

  // 等待某一（组）生成类型完整结束（status 回到 ready），再衔接下一步。
  // 关键：必须等 status 回到 ready，而非 content 一变 truthy 就开始——否则下一步的 send 会
  // 调用 chat.stop() 把仍在流式生成的内容打断。
  function waitForReady(types: string[]): Promise<void> {
    return new Promise((resolve) => {
      let stop: (() => void) | undefined
      const check = () => {
        if (chatApi.status.value === 'ready' && types.includes(chatApi.currentType.value ?? '')) {
          stop?.()
          resolve()
          return true
        }
        return false
      }
      if (check()) return
      stop = watch(
        () => chatApi.status.value,
        () => check(),
      )
    })
  }

  // 单个叙事子任务：聊天类任务须等 status 回到 ready，图像类任务失败时静默降级
  async function runNarrativeTask(task: NarrativeTaskKey) {
    switch (task) {
      case 'case':
        await caseStore.generate()
        await waitForReady(['case', 'case-verify', 'case-fix'])
        break
      case 'story':
        await storyStore.generate()
        await waitForReady(['story', 'story-verify', 'story-fix'])
        break
      case 'conversation':
        await storyStore.generateConversation()
        await waitForReady(['story-conversation'])
        break
      case 'discussion':
        await storyStore.generateDiscussion()
        await waitForReady(['story-discussion'])
        break
      case 'comment':
        await storyStore.generateComment()
        await waitForReady(['story-comment'])
        break
      case 'avatar':
        isAvatarGenerating.value = true
        try {
          await imageStore.face()
        } catch {
          // 头像生成失败时忽略错误，保留占位图
        } finally {
          isAvatarGenerating.value = false
        }
        break
      case 'illustration':
        isIllustrationGenerating.value = true
        try {
          await imageStore.illustration()
        } catch {
          // 插图生成失败时忽略错误
        } finally {
          isIllustrationGenerating.value = false
        }
        break
    }
  }

  async function generateNarrative() {
    // 以开始生成时的设定与顺序为准，避免生成过程中修改导致流程错乱
    const plan = recordStore.getNarrativePlan(deps.getGeneratePlan())
    if (!plan.length) {
      stateStore.toast.add({
        title: '无法生成叙事',
        description: '请在「设定」中至少开启一项内容生成',
        color: 'warning',
        icon: 'i-lucide-settings',
      })
      deps.onEmptyPlan()
      return
    }

    // 全量重置：叙事单页始终从干净状态开始，已设定的生成顺序保持不变
    recordStore.reset()
    imageStore.reset()
    isAvatarGenerating.value = false
    isIllustrationGenerating.value = false
    // 清空病历设定中的教科书部分，仅以自定义内容（含疾病设定）生成病例
    stateStore.case.textbook = null
    // 将「疾病设定」输入框文字同时作为生成故事的自定义提示词（要点设定）
    const diseaseText = deps.getDisease()
    if (diseaseText) {
      stateStore.story.custom = [
        `${NARRATIVE_DISEASE_TAG}${diseaseText}`,
        ...stateStore.story.custom.filter((c) => !c.startsWith(NARRATIVE_DISEASE_TAG)),
      ]
    }

    // 按 record 的设定顺序逐主项串行执行，主项内的子步骤就近跟随
    for (const { tasks } of plan) {
      for (const task of tasks) {
        await runNarrativeTask(task)
      }
    }
  }

  return {
    isGenerating,
    generatingSection,
    isAvatarGenerating,
    isIllustrationGenerating,
    generateNarrative,
  }
}
