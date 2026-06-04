import { isReasoningUIPart, isTextUIPart } from 'ai'
import { getPrompt } from '~/utils/prompts'

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

  const { status, lastParts, currentType, lastMessageRole, send } = useChatApi()

  watch(
    () => lastParts.value,
    (parts) => {
      if (currentType.value !== 'story') return
      if (!parts.length) return
      if (lastMessageRole.value !== 'assistant') return
      for (const part of parts) {
        useStateStore().story.isReasoning = isReasoningUIPart(part)
        handlePart(part)
      }
    },
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

  function handlePart(part: any) {
    if (isReasoningUIPart(part)) {
      story.value.reasoning = part.text
    }
    if (isTextUIPart(part) && part.text?.trim()) {
      story.value.content = part.text
    }
  }

  async function generate() {
    const stateStore = useStateStore()
    const caseStore = useCaseStore()

    reset()

    story.value.custom = [...stateStore.story.custom]
    const customText = story.value.custom.join(', ')

    const text = `病例内容：${JSON.stringify(caseStore.case.content)}, 要点设定：${customText}`

    const model = useModelStore().activeModels.chat
    send(text, {
      type: 'story',
      task: 'generate',
      model,
      reasoning: stateStore.story.reasoning,
      system: await getPrompt('story', 'generate'),
      providerOptions: useProviderStore().getProviderOptions(model.provider, stateStore.story.reasoning),
    })
  }

  return {
    version,
    story,
    reset,
    handlePart,
    status,
    generate,
  }
})
