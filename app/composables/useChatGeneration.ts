import { DefaultChatTransport, isReasoningUIPart, isTextUIPart } from 'ai'
import { Chat } from '@ai-sdk/vue'
import { parse } from 'partial-json'

type GenerateType = 'case' | 'story' | 'test' | 'act' | 'rate' | 'image'
type GenerateTask = 'generate' | 'verify'

const LABELS: Record<GenerateType, Record<GenerateTask, string>> = {
  case: { generate: '生成病例', verify: '验证病例' },
  story: { generate: '生成故事', verify: '验证故事' },
  test: { generate: '生成考核', verify: '验证考核' },
  rate: { generate: '生成评估', verify: '验证评估' },
  image: { generate: '生成图像', verify: '验证图像' },
}
export function useChatGeneration(type: GenerateType, task: GenerateTask) {
  const stateStore = useStateStore()
  const caseStore = useCaseStore()
  const storyStore = useStoryStore()
  const testStore = useTestStore()
  const modelStore = useModelStore()

  const label = computed(() => LABELS[type][task])

  const disabled = computed(() => {
    if (type === 'case') return false
    return !caseStore.case.content || caseStore.case.content.length === 0
  })

  const chat = new Chat({
    transport: new DefaultChatTransport({
      api: stateStore.apiBaseUrl,
      body: {
        ...(type !== 'case' ? { model: modelStore.activeModels[type] } : {}),
        type,
        task,
      },
    }),
    onError: (error) => {
      stateStore.toast.add({
        title: '生成失败',
        description: error.message,
        color: 'error',
        icon: 'i-lucide-alert-circle',
      })
    },
  })

  function submit() {
    if (chat.status === 'error') chat.clearError()
    chat.stop()

    let customText: string

    if (type === 'case') {
      caseStore.reset()
      storyStore.reset()
      caseStore.case.textbook = stateStore.case.textbook ? JSON.parse(JSON.stringify(stateStore.case.textbook)) : null
      caseStore.case.custom = [...stateStore.case.custom]
      customText = caseStore.case.custom.join(', ')
    } else if (type === 'story') {
      storyStore.reset()
      storyStore.story.custom = [...stateStore.story.custom]
      customText = storyStore.story.custom.join(', ')
    } else {
      testStore.reset()
      testStore.test.custom = [...stateStore.test.custom]
      customText = testStore.test.custom.join(', ')
    }

    const text =
      type === 'case'
        ? `要点设定：${stateStore.case.textbook?.content ? Object.values(stateStore.case.textbook.content).join(', ') : ''}, ${customText}`
        : `病例内容：${JSON.stringify(caseStore.case.content)}, 要点设定：${customText}`

    const sendBody: Record<string, unknown> = {
      reasoning: stateStore[type].reasoning,
    }
    if (type === 'case') {
      sendBody.model = modelStore.activeModels.case
    }

    chat.sendMessage({ text }, { body: sendBody })
  }

  function stop() {
    chat.stop()
  }

  function reload() {
    if (type === 'case') submit()
    else chat.regenerate()
  }

  watch(
    () => chat.lastMessage?.parts,
    (parts) => {
      if (!parts) return
      for (const part of parts.slice(1)) {
        stateStore[type].isReasoning = isReasoningUIPart(part)
        if (isReasoningUIPart(part)) {
          if (type === 'case') caseStore.case.reasoning = part.text
          else if (type === 'story') storyStore.story.reasoning = part.text
          else testStore.test.reasoning = part.text
        }
        if (isTextUIPart(part)) {
          if (part.text?.trim()) {
            const content = type === 'story' ? part.text : parse(part.text)
            if (type === 'case') caseStore.case.content = content
            else if (type === 'story') storyStore.story.content = content
            else testStore.test.content = content
          }
        }
      }
    },
    { deep: true },
  )

  const status = computed(() => chat.status)

  return { label, status, disabled, submit, stop, reload }
}
