import { DefaultChatTransport, isReasoningUIPart, isTextUIPart } from 'ai'
import { Chat } from '@ai-sdk/vue'

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

  const chat = new Chat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
    onError: (error) => {
      useStateStore().toast.add({
        title: '生成失败',
        description: error.message,
        color: 'error',
        icon: 'i-lucide-alert-circle',
      })
    },
  })

  const status = computed(() => chat.status === 'idle' ? 'ready' : chat.status)

  watch(
    () => [...(chat.lastMessage?.parts ?? [])],
    (parts) => {
      if (!parts.length) return
      if (chat.lastMessage?.role !== 'assistant') return
      for (const part of parts) {
        useStateStore().rate.isReasoning = isReasoningUIPart(part)
        handlePart(part)
      }
    },
  )

  function reset() {
    rate.value = { ...rateDefault }
  }

  function prepare() {
    const stateStore = useStateStore()
    const caseStore = useCaseStore()

    reset()

    rate.value.custom = [...stateStore.rate.custom]
    const customText = rate.value.custom.join(', ')

    const text = `病例内容：${JSON.stringify(caseStore.case.content)}, 要点设定：${customText}`

    return {
      type: 'rate',
      text,
      body: {
        model: useModelStore().activeModels.rate,
        reasoning: stateStore.rate.reasoning,
      },
    }
  }

  function handlePart(part: any) {
    if (isReasoningUIPart(part)) {
      rate.value.reasoning = part.text
    }
    if (isTextUIPart(part) && part.text?.trim()) {
      rate.value.content = part.text
    }
  }

  function generate() {
    const data = prepare()
    if (chat.status === 'error') chat.clearError()
    chat.stop()
    chat.sendMessage({ text: data.text }, { body: { ...data.body, type: data.type, task: 'generate' } })
  }

  return { version, rate, reset, prepare, handlePart, status, generate }
})
