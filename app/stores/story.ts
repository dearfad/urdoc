import { DefaultChatTransport, isReasoningUIPart, isTextUIPart } from 'ai'
import { Chat } from '@ai-sdk/vue'

const VERSION = '2026-05-31'

export const useStoryStore = defineStore('story', () => {
  const version = ref(VERSION)
  syncStoreVersion(VERSION, 'pinia:story')

  const story = ref<Story>({
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
        useStateStore().story.isReasoning = isReasoningUIPart(part)
        handlePart(part)
      }
    },
    { deep: true },
  )

  function reset() {
    story.value = {
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

    story.value.custom = [...stateStore.story.custom]
    const customText = story.value.custom.join(', ')

    const text = `病例内容：${JSON.stringify(caseStore.case.content)}, 要点设定：${customText}`

    return {
      type: 'story',
      text,
      body: {
        model: useModelStore().activeModels.story,
        reasoning: stateStore.story.reasoning,
      },
    }
  }

  function handlePart(part: any) {
    if (isReasoningUIPart(part)) {
      story.value.reasoning = part.text
    }
    if (isTextUIPart(part) && part.text?.trim()) {
      story.value.content = part.text
    }
  }

  function verify() {}

  function comment() {}

  function converse() {}

  function discuss() {}

  function illustrate() {}

  function generate() {
    const data = prepare()
    if (chat.status === 'error') chat.clearError()
    chat.stop()
    chat.sendMessage({ text: data.text }, { body: { ...data.body, type: data.type, task: 'generate' } })
  }

  return {
    version,
    story,
    reset,
    prepare,
    handlePart,
    verify,
    comment,
    conversation: converse,
    discussion: discuss,
    illustrate,
    status,
    generate,
  }
})
