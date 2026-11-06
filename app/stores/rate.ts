import { DefaultChatTransport, isReasoningUIPart, isTextUIPart } from 'ai'
import { Chat } from '@ai-sdk/vue'

// 能力评估的内容汇总已统一交由 app/utils/context.ts 处理
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

    reset()

    rate.value.custom = [...stateStore.rate.custom]

    // 各项目记录由统一注入器按当前顺序收集，此处只保留评价引导语与用户设定的评价重点
    const parts: string[] = [
      '以下是用户（医生）在当前医学案例学习中已生成的全部记录。请基于这些记录对其临床能力进行综合评价，而不是逐题纠正答案。',
    ]
    if (rate.value.custom.length > 0) {
      parts.push(`## 评价重点\n${rate.value.custom.join(', ')}`)
    }

    return {
      type: 'rate',
      text: parts.join('\n\n'),
      body: {
        model: useModelStore().activeModels.chat,
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

  async function generate() {
    const data = prepare()
    const context = await buildGenerationContext({
      type: 'rate',
      task: 'generate',
      target: 'rate',
      hints: [data.text],
    })
    if (chat.status === 'error') chat.clearError()
    chat.stop()
    const model = data.body.model
    chat.sendMessage(
      { text: context.text },
      {
        body: {
          ...data.body,
          type: data.type,
          task: 'generate',
          instructions: context.instructions,
          providerOptions: useProviderStore().getProviderOptions(model.provider, data.body.reasoning),
          template: getChatTemplate(model),
        },
      },
    )
  }

  return { version, rate, reset, prepare, handlePart, status, generate }
})
