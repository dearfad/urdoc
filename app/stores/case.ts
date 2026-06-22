import { parse } from 'partial-json'
import { isReasoningUIPart, isTextUIPart } from 'ai'
import { safeParseJson } from '~/utils/json'

const VERSION = '2026-05-31'

export const useCaseStore = defineStore('case', () => {
  const version = ref(VERSION)
  syncStoreVersion(VERSION, 'pinia:case')

  const case_ = ref<Case>({
    id: 0,
    tags: [],
    textbook: null,
    custom: [],
    reasoning: null,
    content: null,
  })

  const verifyResult = ref<string | null>(null)
  const verifyReasoning = ref<string | null>(null)

  const { status, lastParts, currentType, lastMessageRole, send } = useChatApi()

  watch(
    () => lastParts.value,
    (parts) => {
      try {
        if (!['case', 'case-verify', 'case-fix'].includes(currentType.value)) return
        if (!parts.length) return
        if (lastMessageRole.value !== 'assistant') return
        for (const part of parts) {
          if (currentType.value === 'case-verify') {
            handleVerifyPart(part)
          } else {
            useStateStore().case.isReasoning = isReasoningUIPart(part)
            handlePart(part)
          }
        }
      } catch (e) {
        console.error('病例解析出错:', e)
      }
    },
  )

  watch(
    () => status.value,
    (newStatus) => {
      if (newStatus !== 'ready') return
      const stateStore = useStateStore()
      if (currentType.value === 'case' && stateStore.autoVerify) {
        if (case_.value.content) {
          nextTick(() => verify())
        }
      } else if (currentType.value === 'case-verify' && stateStore.autoFix) {
        if (verifyResult.value && !/\*\*通过\*\*/.test(verifyResult.value)) {
          if (!_hasAutoFixed) {
            _hasAutoFixed = true
            nextTick(() => fix())
          }
        }
      } else if (currentType.value === 'case-fix' && stateStore.autoVerify) {
        if (case_.value.content) {
          nextTick(() => verify())
        }
      }
    },
  )

  let _hasAutoFixed = false

  function reset() {
    case_.value = {
      id: 0,
      tags: [],
      textbook: null,
      custom: [],
      reasoning: null,
      content: null,
    }
    verifyResult.value = null
    verifyReasoning.value = null
    _hasAutoFixed = false
  }

  function handlePart(part: any) {
    if (isReasoningUIPart(part)) {
      case_.value.reasoning = part.text
    }
    if (isTextUIPart(part) && part.text?.trim()) {
      const parsed = safeParseJson(part.text)
      if (parsed !== null) {
        case_.value.content = parsed
      }
    }
  }

  function handleVerifyPart(part: any) {
    if (isReasoningUIPart(part)) {
      verifyReasoning.value = part.text
    }
    if (isTextUIPart(part) && part.text?.trim()) {
      verifyResult.value = part.text
    }
  }

  async function generate() {
    const stateStore = useStateStore()
    const recordStore = useRecordStore()

    reset()
    recordStore.reset()

    case_.value.textbook = stateStore.case.textbook ? JSON.parse(JSON.stringify(stateStore.case.textbook)) : null
    case_.value.custom = [...stateStore.case.custom]
    const customText = case_.value.custom.join(', ')

    const text = stateStore.case.textbook?.content
      ? `要点设定：${Object.values(stateStore.case.textbook.content).join(', ')}, ${customText}`
      : customText

    const model = useModelStore().activeModels.chat
    send(text, {
      type: 'case',
      task: 'generate',
      model,
      reasoning: stateStore.case.reasoning,
      system: await usePromptStore().getEffectivePrompt('case', 'generate'),
      providerOptions: useProviderStore().getProviderOptions(model.provider, stateStore.case.reasoning),
    })
  }

  async function verify() {
    const stateStore = useStateStore()
    const content = case_.value.content
    if (!content) return
    verifyResult.value = null
    verifyReasoning.value = null
    const text = JSON.stringify(content)
    const model = useModelStore().activeModels.chat
    const system = await usePromptStore().getEffectivePrompt('case', 'verify')
    send(text, {
      type: 'case-verify',
      task: 'verify',
      model,
      reasoning: stateStore.case.reasoning,
      system: system ? `${system}\n\n病例内容：${text}` : `校验以下病例内容是否符合要求：\n\n${text}`,
      providerOptions: useProviderStore().getProviderOptions(model.provider, stateStore.case.reasoning),
    })
  }

  async function fix() {
    const stateStore = useStateStore()
    const content = case_.value.content
    const verify = verifyResult.value
    if (!content || !verify) return
    verifyResult.value = null
    verifyReasoning.value = null
    case_.value.reasoning = null
    const text = JSON.stringify({ 原始病例: content, 校验报告: verify })
    const model = useModelStore().activeModels.chat
    const system = await usePromptStore().getEffectivePrompt('case', 'fix')
    send(text, {
      type: 'case-fix',
      task: 'fix',
      model,
      reasoning: stateStore.case.reasoning,
      system,
      providerOptions: useProviderStore().getProviderOptions(model.provider, stateStore.case.reasoning),
    })
  }

  const markdown = computed(() => {
    if (!case_.value.content) return ''
    if (typeof case_.value.content === 'string') return ''
    try {
      const raw = JSON.stringify(case_.value.content)
      return Object.entries(parse(raw))
        .map(([key, value]) => `**${key}**：${value}`)
        .join('\n\n')
    } catch {
      return ''
    }
  })

  return { version, case: case_, markdown, reset, handlePart, status, generate, verify, verifyResult, verifyReasoning, fix, currentType }
})
