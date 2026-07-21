import { DefaultChatTransport, isReasoningUIPart, isTextUIPart } from 'ai'
import { safeParseJson } from '~/utils/json'
import { Chat } from '@ai-sdk/vue'

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
    userAnswers: null,
    submitted: false,
    score: null,
  })

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

  const status = computed(() => (chat.status === 'idle' ? 'ready' : chat.status))

  watch(
    () => [...(chat.lastMessage?.parts ?? [])],
    (parts) => {
      if (!parts.length) return
      if (chat.lastMessage?.role !== 'assistant') return
      for (const part of parts) {
        useStateStore().test.isReasoning = isReasoningUIPart(part)
        handlePart(part)
      }
    },
  )

  function reset() {
    test.value = {
      id: 0,
      tags: [],
      custom: [],
      reasoning: null,
      content: null,
      userAnswers: null,
      submitted: false,
      score: null,
    }
  }

  function prepare() {
    const stateStore = useStateStore()
    const caseStore = useCaseStore()

    reset()

    test.value.custom = [...stateStore.test.custom]
    const customText = test.value.custom.join(', ')

    const text = `病例内容：${JSON.stringify(caseStore.case.content)}, 要点设定：${customText}`

    return {
      type: 'test',
      text,
      body: {
        model: useModelStore().activeModels.chat,
        reasoning: stateStore.test.reasoning,
      },
    }
  }

  function handlePart(part: any) {
    if (isReasoningUIPart(part)) {
      test.value.reasoning = part.text
    }
    if (isTextUIPart(part) && part.text?.trim()) {
      test.value.content = safeParseJson(part.text)
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
          instructions: await usePromptStore().getEffectivePrompt('test', 'generate'),
          providerOptions: useProviderStore().getProviderOptions(model.provider, data.body.reasoning),
        },
      },
    )
  }

  function setUserAnswer(key: string, answer: string) {
    if (!test.value.userAnswers) {
      test.value.userAnswers = {}
    }
    test.value.userAnswers[key] = answer
  }

  function submitTest() {
    const content = test.value.content
    if (!content) return

    const questions = typeof content === 'string' ? safeParseJson(content) : content
    if (!questions || typeof questions !== 'object') return

    const entries = Object.entries(questions) as [string, any][]
    let correct = 0
    const total = entries.length
    for (const [key, q] of entries) {
      const userAns = test.value.userAnswers?.[key]
      if (userAns && q.答案 && userAns === q.答案) {
        correct++
      }
    }
    test.value.score = total > 0 ? Math.round((correct / total) * 100) : 0
    test.value.submitted = true
  }

  function resetTest() {
    test.value.userAnswers = null
    test.value.submitted = false
    test.value.score = null
  }

  return { version, test, reset, prepare, handlePart, status, generate, setUserAnswer, submitTest, resetTest }
})
