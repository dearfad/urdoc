import { parse } from 'partial-json'
import { DefaultChatTransport, isReasoningUIPart, isTextUIPart } from 'ai'
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

  const status = computed(() => chat.status === 'idle' ? 'ready' : chat.status)

  watch(
    () => chat.lastMessage?.parts,
    (parts) => {
      if (!parts) return
      for (const part of parts.slice(1)) {
        useStateStore().test.isReasoning = isReasoningUIPart(part)
        handlePart(part)
      }
    },
    { deep: true },
  )

  function reset() {
    test.value = {
      id: 0,
      tags: [],
      custom: [],
      reasoning: null,
      content: null,
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
        model: useModelStore().activeModels.test,
        reasoning: stateStore.test.reasoning,
      },
    }
  }

  function handlePart(part: any) {
    if (isReasoningUIPart(part)) {
      test.value.reasoning = part.text
    }
    if (isTextUIPart(part) && part.text?.trim()) {
      test.value.content = parse(part.text)
    }
  }

  function generate() {
    const data = prepare()
    if (chat.status === 'error') chat.clearError()
    chat.stop()
    chat.sendMessage({ text: data.text }, { body: { ...data.body, type: data.type, task: 'generate' } })
  }

  return { version, test, reset, prepare, handlePart, status, generate }
})
