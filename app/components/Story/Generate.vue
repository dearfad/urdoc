<template>
  <!-- <UButton icon="i-lucide-rocket" @click="onSubmit" variant="solid" color="primary" >生成病例</UButton> -->
  <UChatPromptSubmit
    :status="chat.status"
    :disabled="!caseStore.case.content || caseStore.case.content.length === 0"
    @stop="chat.stop()"
    @reload="chat.regenerate()"
    @click="onSubmit"
    streaming-color="success"
  >
    生成故事
  </UChatPromptSubmit>
</template>

<script setup>
import { DefaultChatTransport, isReasoningUIPart, isTextUIPart } from 'ai'
import { Chat } from '@ai-sdk/vue'
const stateStore = useStateStore()
const caseStore = useCaseStore()
const storyStore = useStoryStore()
const modelStore = useModelStore()

const chat = new Chat({
  transport: new DefaultChatTransport({
    api: stateStore.apiBaseUrl,
    body: {
      model: modelStore.activeModels.story,
      type: 'story',
      task: 'generate',
    },
  }),
})

function onSubmit() {
  storyStore.reset()
  storyStore.story.custom = [...stateStore.story.custom]
  const custom = storyStore.story.custom.join(', ')
  const text = `病例内容：${JSON.stringify(caseStore.case.content)}, 要点设定：${custom}`
  chat.sendMessage({ text: text }, { body: { reasoning: stateStore.story.reasoning } })
}

watch(
  () => chat.lastMessage?.parts,
  (parts) => {
    if (!parts) return
    for (const part of parts.slice(1)) {
      stateStore.story.isReasoning = isReasoningUIPart(part)
      if (isReasoningUIPart(part)) storyStore.story.reasoning = part.text
      if (isTextUIPart(part)) {
        if (part.text && part.text.trim().length > 0) {
          storyStore.story.content = part.text
        }
      }
    }
  },
  { deep: true },
)
</script>
