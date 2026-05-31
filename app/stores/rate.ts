import { isReasoningUIPart, isTextUIPart } from 'ai'

const VERSION = '2026-05-06'

const rateDefault = {
  id: 0,
  tags: [],
  custom: [],
  reasoning: null,
  content: null,
}

export const useRateStore = defineStore('rate', () => {
  const version = ref(VERSION)
  syncStoreVersion(VERSION, 'pinia:rate')

  const rate = ref<Rate>({ ...rateDefault })

  const { status, send, stop } = useChatGenerations()

  function reset() {
    rate.value = { ...rateDefault }
  }

  function generate() {
    const stateStore = useStateStore()
    const caseStore = useCaseStore()

    reset()

    rate.value.custom = [...stateStore.rate.custom]
    const customText = rate.value.custom.join(', ')

    const text = `病例内容：${JSON.stringify(caseStore.case.content)}, 要点设定：${customText}`

    send({
      type: 'rate',
      text,
      body: {
        model: useModelStore().activeModels.rate,
        reasoning: stateStore.rate.reasoning,
      },
      onPart: (part) => {
        if (isReasoningUIPart(part)) {
          rate.value.reasoning = part.text
        }
        if (isTextUIPart(part) && part.text?.trim()) {
          rate.value.content = part.text
        }
      },
    })
  }

  return { version, rate, reset, generate, status, stop }
})
