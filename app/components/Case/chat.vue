<template>
  <div class="flex flex-col">
    <UChatPromptSubmit :status="chat.status" @stop="chat.stop()" @reload="chat.regenerate()" block @click="onSubmit">
      开始
    </UChatPromptSubmit>
    <!-- <ClientOnly>
      <pre class="whitespace-pre-wrap wrap-break-words overflow-x-auto">{{ chat.lastMessage?.parts[1]?.text }}</pre>
    </ClientOnly> -->
    <!-- <UChatMessage :parts="chat.lastMessage?.parts ?? [{ type: 'text', text: '' }]" :id="id" role="assistant">
      <template #content="{ part }">
        <MDC
          v-if="part.type === 'text'"
          :value="part.text"
          :cache-key="`message-${id}-${part.type}`"
          class="*:first:mt-0 *:last:mb-0"
        />
      </template>
    </UChatMessage> -->
    <!-- {{ chat.messages }} -->
    <!-- <UChatMessages :messages="chat.messages" :status="chat.status">
      <template #content="{ message }">
        <div v-if="message.role === 'assistant'">
          <template v-for="(part, index) in message.parts" :key="`${message.id}-${part.type}-${index}`">
            <UChatReasoning v-if="isReasoningUIPart(part)" :text="part.text" :streaming="true">
              <MDC
                :value="part.text"
                :cache-key="`reasoning-${message.id}-${index}`"
                class="*:first:mt-0 *:last:mb-0"
              />
            </UChatReasoning>

            <template v-else-if="isTextUIPart(part)">
              <MDC
                v-if="message.role === 'assistant'"
                :value="md(part.text)"
                :cache-key="`${message.id}-${index}`"
                class="*:first:mt-0 *:last:mb-0"
              />
              <p v-else-if="message.role === 'user'" class="whitespace-pre-wrap">
                {{ part.text }}
              </p>
            </template>
          </template>
        </div>
      </template>
    </UChatMessages> -->

    <!-- {{ chat }} -->
  </div>
</template>

<script setup>
import { isReasoningUIPart, isTextUIPart, DefaultChatTransport, generateId } from 'ai'
import { Chat } from '@ai-sdk/vue'
import { parse } from 'partial-json'

const chat = new Chat({
  transport: new DefaultChatTransport({
    api: '/api/model/chat',
    body: {
      providerName: 'InternAi',
      modelName: 'intern-s1',
      apiKeyName: 'shushengApiKey',
      baseURL: 'https://chat.intern-ai.org.cn/api/v1',
    },
  }),
})

import defaultCasePrompt from '@/assets/prompts/case/generate.md?raw'
const caseStore = useCaseStore()
// const casetemp = ref('')

function onSubmit() {
  chat.messages = [
    { id: '1', role: 'system', parts: [{ type: 'text', text: defaultCasePrompt }] },
    {
      id: '2',
      role: 'user',
      parts: [
        {
          type: 'text',
          text: `要点设定：${caseStore.case.tags.join('，')}\n\n来源：${Object.values(caseStore.case.source.content).join('，')}`,
        },
      ],
    },
  ]
  chat.sendMessage()
}

watch(
  () => chat.lastMessage?.parts?.[1]?.text,
  (text) => {
    if (!text) return
    try {
      caseStore.case.content = text
    } catch (e) {
      console.error('Failed to parse case content:', e)
    }
  },
  { immediate: false },
)
// const id = ref(generateId())
// const md = computed(() => {
//   if (!chat.lastMessage?.parts) return []
//   // const partialJson = parse(text)
//   // const markdown = Object.entries(partialJson)
//   //   .map(([key, value]) => `**${key}**: ${value}`)
//   //   .join('\n')
//   // return Object.entries(parse(chat.lastMessage?.parts[1]?.text.split('```json')[1]?.trim())) || []
//   return chat.lastMessage?.parts[1]?.text || []
// })
</script>
