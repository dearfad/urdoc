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
    const caseStore = useCaseStore()

    reset()

    story.value.custom = [...stateStore.story.custom]
    const customText = story.value.custom.join(', ')

    const text = `病例内容：${JSON.stringify(caseStore.case.content)}, 要点设定：${customText}`

    const model = useModelStore().resolveModel('story')
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
    const model = useModelStore().resolveModel('story')
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
    const model = useModelStore().resolveModel('story')
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
    const caseStore = useCaseStore()
    const storyContent = story.value.content
    if (!storyContent) return
    conversation.value = { content: null, reasoning: null }
    const model = useModelStore().resolveModel('conversation')
    const roleHint = story.value.custom?.length
      ? `角色设定：${story.value.custom.join('，')}`
      : '角色设定：医生与患者'
    const text = `病例内容：${JSON.stringify(caseStore.case.content)}\n\n小故事：\n${storyContent}\n\n${roleHint}`
    const instructions = await usePromptStore().getEffectivePrompt('conversation', 'prompt')
    send(text, {
      type: 'story-conversation',
      task: 'conversation',
      model,
      reasoning: stateStore.conversation.reasoning,
      instructions: instructions
        ? `${instructions}\n\n${roleHint}\n\n病例内容：${JSON.stringify(caseStore.case.content)}\n\n小故事：\n${storyContent}`
        : `基于以下病例和患者小故事，生成一段两位角色（${roleHint.replace('角色设定：', '')}）的专业对话：\n\n病例：${JSON.stringify(caseStore.case.content)}\n\n小故事：\n${storyContent}`,
      providerOptions: useProviderStore().getProviderOptions(model.provider, stateStore.conversation.reasoning),
    })
  }

  async function generateDiscussion() {
    const stateStore = useStateStore()
    const caseStore = useCaseStore()
    const storyContent = story.value.content
    const conversationContent = conversation.value.content
    if (!storyContent || !conversationContent) return
    discussion.value = { content: null, reasoning: null }
    const model = useModelStore().resolveModel('discussion')
    const text = `病例内容：${JSON.stringify(caseStore.case.content)}\n\n小故事：\n${storyContent}\n\n人物对话：\n${conversationContent}`
    const instructions = await usePromptStore().getEffectivePrompt('discussion', 'prompt')
    send(text, {
      type: 'story-discussion',
      task: 'discussion',
      model,
      reasoning: stateStore.discussion.reasoning,
      instructions: instructions
        ? `${instructions}\n\n病例内容：${JSON.stringify(caseStore.case.content)}\n\n小故事：\n${storyContent}\n\n人物对话：\n${conversationContent}`
        : `基于以下病例、小故事和人物对话，生成一组网络评论区风格的精选讨论：\n\n病例：${JSON.stringify(caseStore.case.content)}\n\n小故事：\n${storyContent}\n\n人物对话：\n${conversationContent}`,
      providerOptions: useProviderStore().getProviderOptions(model.provider, stateStore.discussion.reasoning),
    })
  }

  async function generateComment() {
    const stateStore = useStateStore()
    const caseStore = useCaseStore()
    const storyContent = story.value.content
    const conversationContent = conversation.value.content
    const discussionContent = discussion.value.content
    if (!storyContent || !conversationContent || !discussionContent) return
    comment.value = { content: null, reasoning: null }
    const model = useModelStore().resolveModel('comment')
    const context = `病例内容：${JSON.stringify(caseStore.case.content)}\n\n小故事：\n${storyContent}\n\n人物对话：\n${conversationContent}\n\n网友讨论：\n${discussionContent}`
    const instructions = await usePromptStore().getEffectivePrompt('comment', 'prompt')
    send(context, {
      type: 'story-comment',
      task: 'comment',
      model,
      reasoning: stateStore.comment.reasoning,
      instructions: instructions
        ? `${instructions}\n\n${context}`
        : `基于以下病例、故事、对话和讨论，生成五段式专家点评：\n\n${context}`,
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
