<template>
  <UChatPromptSubmit
    :status="chat.status"
    :disabled="!caseStore.case.content || !caseStore.case.content.length === 0"
    @stop="chat.stop()"
    @reload="chat.regenerate()"
    @click="onSubmit"
    streaming-color="success"
  >
    生成考核
  </UChatPromptSubmit>
</template>

<script setup>
import { DefaultChatTransport, isReasoningUIPart, isTextUIPart } from 'ai'
import { Chat } from '@ai-sdk/vue'
import { parse } from 'partial-json'

const stateStore = useStateStore()
const caseStore = useCaseStore()
const testStore = useTestStore()
const modelStore = useModelStore()

const chat = new Chat({
  transport: new DefaultChatTransport({
    api: '/api/chat',
    body: {
      model: modelStore.model,
      type: 'test',
      task: 'generate',
    },
  }),
})

function onSubmit() {
  testStore.reset()
  testStore.test.custom = [...stateStore.test.custom]
  const custom = testStore.test.custom.join(', ')
  const text = `病例内容：${JSON.stringify(caseStore.case.content)}, 要点设定：${custom}`
  chat.sendMessage({ text: text }, { body: { reasoning: stateStore.test.reasoning } })
}

watch(
  () => chat.lastMessage?.parts,
  (parts) => {
    if (!parts) return
    for (const part of parts.slice(1)) {
      stateStore.test.isReasoning = isReasoningUIPart(part)
      if (isReasoningUIPart(part)) testStore.test.reasoning = part.text
      if (isTextUIPart(part)) {
        if (part.text && part.text.trim().length > 0) {
          testStore.test.content = parse(part.text)
        }
      }
    }
  },
  { deep: true },
)
</script>
