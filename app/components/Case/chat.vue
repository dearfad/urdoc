<template>
  <UButton icon="i-lucide-send" @click="onSubmit" variant="ghost" />
</template>

<script setup>
import { DefaultChatTransport } from 'ai'
import { Chat } from '@ai-sdk/vue'
import { parse } from 'partial-json'

const caseStore = useCaseStore()

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
  const tags = caseStore.case.tags.join(', ')
  const source = Object.values(caseStore.case.source.content).join(', ')
  const text = `要点设定：${tags}\n\n来源：${source}`
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
