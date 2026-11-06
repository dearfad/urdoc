import { isReasoningUIPart, isTextUIPart } from 'ai'
import type { StorySubContent } from '~/types/story'

const VERSION = '2026-10-31'

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

  const conversation = ref<StorySubContent>({ content: null, reasoning: null })
  const discussion = ref<StorySubContent>({ content: null, reasoning: null })
  const comment = ref<StorySubContent>({ content: null, reasoning: null })

  const { status, lastParts, currentType, lastMessageRole, send } = useChatApi()

  watch(
    () => lastParts.value,
    (parts) => {
      try {
        if (!['story', 'story-verify', 'story-fix', 'story-conversation', 'story-discussion', 'story-comment'].includes(currentType.value)) return
        if (!parts.length) return
        if (lastMessageRole.value !== 'assistant') return
        for (const part of parts) {
          if (currentType.value === 'story-verify') {
            handleVerifyPart(part)
          } else if (currentType.value === 'story-conversation') {
            useStateStore().story.isReasoning = isReasoningUIPart(part)
            handleSubPart(part, conversation)
          } else if (currentType.value === 'story-discussion') {
            useStateStore().story.isReasoning = isReasoningUIPart(part)
            handleSubPart(part, discussion)
          } else if (currentType.value === 'story-comment') {
            useStateStore().story.isReasoning = isReasoningUIPart(part)
            handleSubPart(part, comment)
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
    conversation.value = { content: null, reasoning: null }
    discussion.value = { content: null, reasoning: null }
    comment.value = { content: null, reasoning: null }
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

  function handleSubPart(part: any, target: Ref<StorySubContent>) {
    if (isReasoningUIPart(part)) {
      target.value.reasoning = part.text
    }
    if (isTextUIPart(part) && part.text?.trim()) {
      target.value.content = part.text
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

    reset()

    story.value.custom = [...stateStore.story.custom]
    const customText = story.value.custom.join(', ')

    const context = await buildGenerationContext({
      type: 'story',
      task: 'generate',
      target: 'story',
      hints: [customText ? `要点设定：${customText}` : ''],
    })

    const model = useModelStore().activeModels.chat
    send(context.text, {
      type: 'story',
      task: 'generate',
      model,
      reasoning: stateStore.story.reasoning,
      instructions: context.instructions,
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

  async function generateConversation() {
    const stateStore = useStateStore()
    conversation.value = { content: null, reasoning: null }
    const roleHint = story.value.custom?.length
      ? `角色设定：${story.value.custom.join('，')}`
      : '角色设定：医生与患者'
    const context = await buildGenerationContext({
      type: 'conversation',
      task: 'prompt',
      target: null,
      excludeTitles: ['医患对话'],
      hints: [roleHint],
    })
    const model = useModelStore().activeModels.chat
    send(context.text, {
      type: 'story-conversation',
      task: 'conversation',
      model,
      reasoning: stateStore.conversation.reasoning,
      instructions: context.instructions,
      providerOptions: useProviderStore().getProviderOptions(model.provider, stateStore.conversation.reasoning),
    })
  }

  async function generateDiscussion() {
    const stateStore = useStateStore()
    discussion.value = { content: null, reasoning: null }
    const context = await buildGenerationContext({
      type: 'discussion',
      task: 'prompt',
      target: null,
      excludeTitles: ['话题讨论'],
    })
    const model = useModelStore().activeModels.chat
    send(context.text, {
      type: 'story-discussion',
      task: 'discussion',
      model,
      reasoning: stateStore.discussion.reasoning,
      instructions: context.instructions,
      providerOptions: useProviderStore().getProviderOptions(model.provider, stateStore.discussion.reasoning),
    })
  }

  async function generateComment() {
    const stateStore = useStateStore()
    comment.value = { content: null, reasoning: null }
    const context = await buildGenerationContext({
      type: 'comment',
      task: 'prompt',
      target: null,
      excludeTitles: ['专家点评'],
    })
    const model = useModelStore().activeModels.chat
    send(context.text, {
      type: 'story-comment',
      task: 'comment',
      model,
      reasoning: stateStore.comment.reasoning,
      instructions: context.instructions,
      providerOptions: useProviderStore().getProviderOptions(model.provider, stateStore.comment.reasoning),
    })
  }

  return {
    version,
    story,
    verifyResult,
    verifyReasoning,
    conversation,
    discussion,
    comment,
    reset,
    handlePart,
    status,
    generate,
    verify,
    fix,
    generateConversation,
    generateDiscussion,
    generateComment,
    currentType,
  }
})
