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
    const storyStore = useStoryStore()
    const testStore = useTestStore()
    const actStore = useActStore()

    reset()

    rate.value.custom = [...stateStore.rate.custom]

    const parts: string[] = []

    parts.push('以下是用户（医生）完成一例完整诊疗流程的全部记录，包括病例分析、病史采集、理论考核和问诊实践。请基于这些记录对其临床能力进行综合评价，而不是逐题纠正答案。')

    parts.push(`## 病例内容\n${JSON.stringify(caseStore.case.content)}`)

    if (storyStore.story.content) {
      parts.push(`## 病史采集结果\n${storyStore.story.content}`)
    }

    if (testStore.test.content) {
      const testContent = typeof testStore.test.content === 'string'
        ? testStore.test.content
        : JSON.stringify(testStore.test.content)
      const testRecord = [`题目：${testContent}`]
      if (testStore.test.userAnswers) {
        testRecord.push(`用户答案：${JSON.stringify(testStore.test.userAnswers)}`)
      }
      if (testStore.test.score !== null) {
        testRecord.push(`得分：${testStore.test.score}`)
      }
      parts.push(`## 理论考核记录\n${testRecord.join('\n')}`)
    }

    if (actStore.act.content && actStore.act.content.length > 0) {
      const conversationText = actStore.act.content
        .filter((m) => m.content)
        .map((m) => {
          const role = m.role === 'user' ? '医生' : '患者'
          return `${role}：${m.content}`
        })
        .join('\n')
      parts.push(`## 问诊对话记录\n${conversationText}`)
    }

    if (actStore.act.quiz) {
      const quizRecord = [`题目：${JSON.stringify(actStore.act.quiz)}`]
      if (actStore.act.userAnswers) {
        quizRecord.push(`用户答案：${JSON.stringify(actStore.act.userAnswers)}`)
      }
      if (actStore.act.quizScore !== null) {
        quizRecord.push(`得分：${actStore.act.quizScore}`)
      }
      parts.push(`## 问诊考核记录\n${quizRecord.join('\n')}`)
    }

    if (rate.value.custom.length > 0) {
      parts.push(`## 评价重点\n${rate.value.custom.join(', ')}`)
    }

    const text = parts.join('\n\n')

    return {
      type: 'rate',
      text,
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
    if (chat.status === 'error') chat.clearError()
    chat.stop()
    const model = data.body.model
    chat.sendMessage(
      { text: data.text },
      {
        body: {
          ...data.body,
          type: data.type,
          task: 'generate',
          system: await usePromptStore().getEffectivePrompt('rate', 'generate') || '',
          providerOptions: useProviderStore().getProviderOptions(model.provider, data.body.reasoning),
        },
      },
    )
  }

  return { version, rate, reset, prepare, handlePart, status, generate }
})
