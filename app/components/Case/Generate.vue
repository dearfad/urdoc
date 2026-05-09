<template>
  <!-- <UButton icon="i-lucide-rocket" @click="onSubmit" variant="solid" color="primary" >生成病例</UButton> -->
  <UChatPromptSubmit
    :status="chat.status"
    @stop="chat.stop()"
    @reload="chat.regenerate()"
    @click="onSubmit"
    streaming-color="success"
  >
    生成病例
  </UChatPromptSubmit>
</template>

<script setup>
import { DefaultChatTransport, isReasoningUIPart, isTextUIPart } from 'ai'
import { Chat } from '@ai-sdk/vue'
import { parse } from 'partial-json'

const caseStore = useCaseStore()
const stateStore = useStateStore()
const storyStore = useStoryStore()
const modelStore = useModelStore()

const chat = new Chat({
  transport: new DefaultChatTransport({
    api: '/api/chat',
    body: {
      model: modelStore.model,
      type: 'case',
      task: 'generate',
    },
  }),
})

function onSubmit() {
  caseStore.reset()
  storyStore.reset()
  caseStore.case.custom = [...stateStore.case.custom]
  caseStore.case.textbook = stateStore.case.textbook ? JSON.parse(JSON.stringify(stateStore.case.textbook)) : null
  const custom = caseStore.case.custom.join(', ')
  const textbook = caseStore.case.textbook?.content ? Object.values(caseStore.case.textbook.content).join(', ') : ''
  const text = `要点设定：${textbook}, ${custom}`
  chat.sendMessage({ text: text }, { body: { reasoning: stateStore.case.reasoning } })
}

watch(
  // () => chat.lastMessage?.parts?.[1]?.text,
  () => chat.lastMessage?.parts,
  (parts) => {
    if (!parts) return
    for (const part of parts.slice(1)) {
      stateStore.case.isReasoning = isReasoningUIPart(part)
      if (isReasoningUIPart(part)) caseStore.case.reasoning = part.text
      if (isTextUIPart(part)) {
        if (part.text && part.text.trim().length > 0) {
          caseStore.case.content = parse(part.text)
        }
      }
    }
  },
  { deep: true },
)
</script>
