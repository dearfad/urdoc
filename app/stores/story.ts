import { isReasoningUIPart, isTextUIPart } from 'ai'

const VERSION = '2026-06-23'

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

  const verifyResult = ref<string | null>(null)
  const verifyReasoning = ref<string | null>(null)

  const { status, lastParts, currentType, lastMessageRole, send } = useChatApi()

  watch(
    () => lastParts.value,
    (parts) => {
      try {
        if (!['story', 'story-verify', 'story-fix'].includes(currentType.value)) return
        if (!parts.length) return
        if (lastMessageRole.value !== 'assistant') return
        for (const part of parts) {
          if (currentType.value === 'story-verify') {
            handleVerifyPart(part)
          } else {
            useStateStore().story.isReasoning = isReasoningUIPart(part)
            handlePart(part)
          }
        }
      } catch (e) {
        console.error('故事解析出错:', e)
      }
    },
  )

  watch(
    () => status.value,
    (newStatus) => {
      if (newStatus !== 'ready') return
      const stateStore = useStateStore()
      if (currentType.value === 'story' && stateStore.autoVerify) {
        if (story.value.content) {
          nextTick(() => verify())
        }
      } else if (currentType.value === 'story-verify' && stateStore.autoFix) {
        if (verifyResult.value && !/\*\*通过\*\*/.test(verifyResult.value)) {
          if (!_hasAutoFixed) {
            _hasAutoFixed = true
            nextTick(() => fix())
          }
        }
      } else if (currentType.value === 'story-fix' && stateStore.autoVerify) {
        if (story.value.content) {
          nextTick(() => verify())
        }
      }
    },
  )

  let _hasAutoFixed = false

  function reset() {
    story.value = {
      id: 0,
      tags: [],
      custom: [],
      reasoning: null,
      content: null,
    }
    verifyResult.value = null
    verifyReasoning.value = null
    _hasAutoFixed = false
  }

  function handlePart(part: any) {
    if (isReasoningUIPart(part)) {
      story.value.reasoning = part.text
    }
    if (isTextUIPart(part) && part.text?.trim()) {
      story.value.content = part.text
    }
  }

  function handleVerifyPart(part: any) {
    if (isReasoningUIPart(part)) {
      verifyReasoning.value = part.text
    }
    if (isTextUIPart(part) && part.text?.trim()) {
      verifyResult.value = part.text
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
      instructions: await usePromptStore().getEffectivePrompt('story', 'generate'),
      providerOptions: useProviderStore().getProviderOptions(model.provider, stateStore.story.reasoning),
    })
  }

  async function verify() {
    const stateStore = useStateStore()
    const content = story.value.content
    if (!content) return
    verifyResult.value = null
    verifyReasoning.value = null
    const model = useModelStore().activeModels.chat
    const instructions = await usePromptStore().getEffectivePrompt('story', 'verify')
    send(content, {
      type: 'story-verify',
      task: 'verify',
      model,
      reasoning: stateStore.story.reasoning,
      instructions: instructions ? `${instructions}\n\n故事内容：${content}` : `校验以下故事内容是否符合要求：\n\n${content}`,
      providerOptions: useProviderStore().getProviderOptions(model.provider, stateStore.story.reasoning),
    })
  }

  async function fix() {
    const stateStore = useStateStore()
    const content = story.value.content
    const verify = verifyResult.value
    if (!content || !verify) return
    verifyResult.value = null
    verifyReasoning.value = null
    story.value.reasoning = null
    const text = `原始故事：\n${content}\n\n校验报告：\n${verify}`
    const model = useModelStore().activeModels.chat
    const instructions = await usePromptStore().getEffectivePrompt('story', 'fix')
    send(text, {
      type: 'story-fix',
      task: 'fix',
      model,
      reasoning: stateStore.story.reasoning,
      instructions,
      providerOptions: useProviderStore().getProviderOptions(model.provider, stateStore.story.reasoning),
    })
  }

  return {
    version,
    story,
    verifyResult,
    verifyReasoning,
    reset,
    handlePart,
    status,
    generate,
    verify,
    fix,
    currentType,
  }
})
