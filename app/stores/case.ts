import { parse } from 'partial-json'
import { isReasoningUIPart, isTextUIPart } from 'ai'

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

  const { status, lastParts, currentType, lastMessageRole, send } = useChatApi()

  watch(
    () => lastParts.value,
    (parts) => {
      if (currentType.value !== 'case') return
      if (!parts.length) return
      if (lastMessageRole.value !== 'assistant') return
      for (const part of parts) {
        useStateStore().case.isReasoning = isReasoningUIPart(part)
        handlePart(part)
      }
    },
  )

  function reset() {
    case_.value = {
      id: 0,
      tags: [],
      textbook: null,
      custom: [],
      reasoning: null,
      content: null,
    }
  }

  function handlePart(part: any) {
    if (isReasoningUIPart(part)) {
      case_.value.reasoning = part.text
    }
    if (isTextUIPart(part) && part.text?.trim()) {
      case_.value.content = parse(part.text)
    }
  }

  function generate() {
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

    send(text, {
      type: 'case',
      task: 'generate',
      model: useModelStore().activeModels.case,
      reasoning: stateStore.case.reasoning,
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

  return { version, case: case_, markdown, reset, handlePart, status, generate }
})
