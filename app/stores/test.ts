import { parse } from 'partial-json'
import { isReasoningUIPart, isTextUIPart } from 'ai'

const VERSION = '2026-05-06'

export const useTestStore = defineStore('test', () => {
  const version = ref(VERSION)
  syncStoreVersion(VERSION, 'pinia:test')

  const test = ref<Test>({
    id: 0,
    tags: [],
    custom: [],
    reasoning: null,
    content: null,
  })

  const { status, send, stop } = useChatGenerations()

  function reset() {
    test.value = {
      id: 0,
      tags: [],
      custom: [],
      reasoning: null,
      content: null,
    }
  }

  function generate() {
    const stateStore = useStateStore()
    const caseStore = useCaseStore()

    reset()

    test.value.custom = [...stateStore.test.custom]
    const customText = test.value.custom.join(', ')

    const text = `病例内容：${JSON.stringify(caseStore.case.content)}, 要点设定：${customText}`

    send({
      type: 'test',
      text,
      body: {
        model: useModelStore().activeModels.test,
        reasoning: stateStore.test.reasoning,
      },
      onPart: (part) => {
        if (isReasoningUIPart(part)) {
          test.value.reasoning = part.text
        }
        if (isTextUIPart(part) && part.text?.trim()) {
          test.value.content = parse(part.text)
        }
      },
    })
  }

  return { version, test, reset, generate, status, stop }
})
