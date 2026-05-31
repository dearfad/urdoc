import { parse } from 'partial-json'
import { DefaultChatTransport, isReasoningUIPart, isTextUIPart } from 'ai'
import { Chat } from '@ai-sdk/vue'

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
        useStateStore().case.isReasoning = isReasoningUIPart(part)
        handlePart(part)
      }
    },
    { deep: true },
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

  function prepare() {
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

    return {
      type: 'case',
      text,
      body: {
        model: useModelStore().activeModels.case,
        reasoning: stateStore.case.reasoning,
      },
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

  function verify() {}

  function generate() {
    const data = prepare()
    if (chat.status === 'error') chat.clearError()
    chat.stop()
    chat.sendMessage({ text: data.text }, { body: { ...data.body, type: data.type, task: 'generate' } })
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

  return { version, case: case_, markdown, reset, prepare, handlePart, verify, status, generate }
})
