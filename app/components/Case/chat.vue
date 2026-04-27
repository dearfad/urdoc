<template>
  <UButton icon="i-lucide-rocket" @click="onSubmit" variant="solid" color="primary">生成病例</UButton>
</template>

<script setup>
import { DefaultChatTransport } from 'ai'
import { Chat } from '@ai-sdk/vue'
import { parse } from 'partial-json'

const caseStore = useCaseStore()
const stateStore = useStateStore()

const chat = new Chat({
  transport: new DefaultChatTransport({
    api: '/api/chat',
    body: {
      providerName: 'InternAi',
      modelName: 'intern-s1',
      apiKeyName: 'shushengApiKey',
      baseURL: 'https://chat.intern-ai.org.cn/api/v1',
      type: 'case',
      task: 'generate',
    },
  }),
})

function onSubmit() {
  caseStore.case.custom = [...stateStore.case.custom]
  caseStore.case.textbook = stateStore.case.textbook ? JSON.parse(JSON.stringify(stateStore.case.textbook)) : null
  const custom = caseStore.case.custom.join(', ')
  const textbook = caseStore.case.textbook?.content ? Object.values(caseStore.case.textbook.content).join(', ') : ''
  const text = `要点设定：${custom}\n\n来源：${textbook}`
  chat.sendMessage({ text: text })
}

watch(
  () => chat.lastMessage?.parts?.[1]?.text,
  (text) => {
    if (!text) return
    caseStore.case.content = parse(text)
  },
)
</script>
