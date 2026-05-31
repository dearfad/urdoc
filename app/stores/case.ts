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

  const { status, send, stop } = useChatGenerations()

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

  function generate() {
    const stateStore = useStateStore()
    const storyStore = useStoryStore()

    reset()
    storyStore.reset()

    case_.value.textbook = stateStore.case.textbook ? JSON.parse(JSON.stringify(stateStore.case.textbook)) : null
    case_.value.custom = [...stateStore.case.custom]
    const customText = case_.value.custom.join(', ')

    const text = stateStore.case.textbook?.content
      ? `要点设定：${Object.values(stateStore.case.textbook.content).join(', ')}, ${customText}`
      : customText

    send({
      type: 'case',
      text,
      body: {
        model: useModelStore().activeModels.case,
        reasoning: stateStore.case.reasoning,
      },
      onPart: (part) => {
        if (isReasoningUIPart(part)) {
          case_.value.reasoning = part.text
        }
        if (isTextUIPart(part) && part.text?.trim()) {
          case_.value.content = parse(part.text)
        }
      },
    })
  }

  function verify() {}

  return { version, case: case_, reset, generate, verify, status, stop }
})
