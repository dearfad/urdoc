<template>
  <div>
    <UChatPrompt v-model="input" :error="chat.error" @submit="onSubmit">
      <UChatPromptSubmit :status="chat.status" @stop="chat.stop()" @reload="chat.regenerate()" />
    </UChatPrompt>
    <UChatPrompt v-model="casetemp" :error="chat.error" @submit="onSubmitCase">
      <UChatPromptSubmit :status="chat.status" @stop="chat.stop()" @reload="chat.regenerate()" />
    </UChatPrompt>
    <UChatMessages :messages="chat.messages" :status="chat.status">
      <template #content="{ message }">
        <template v-for="(part, index) in message.parts" :key="`${message.id}-${part.type}-${index}`">
          <UChatReasoning v-if="isReasoningUIPart(part)" :text="part.text" :streaming="true">
            <MDC :value="part.text" :cache-key="`reasoning-${message.id}-${index}`" class="*:first:mt-0 *:last:mb-0" />
          </UChatReasoning>

          <template v-else-if="isTextUIPart(part)">
            <MDC
              v-if="message.role === 'assistant'"
              :value="part.text"
              :cache-key="`${message.id}-${index}`"
              class="*:first:mt-0 *:last:mb-0"
            />
            <p v-else-if="message.role === 'user'" class="whitespace-pre-wrap">
              {{ part.text }}
            </p>
          </template>
        </template>
      </template>
    </UChatMessages>
  </div>
</template>

<script setup>
import { isReasoningUIPart, isTextUIPart, isToolUIPart, getToolName, DefaultChatTransport } from 'ai'
import { Chat } from '@ai-sdk/vue'

const input = ref('')
const chat = new Chat({
  transport: new DefaultChatTransport({
    api: '/api/model/chat',
  }),
})

function onSubmit() {
  chat.sendMessage({ text: input.value })
  input.value = ''
}

import defaultCasePrompt from '@/assets/prompts/case/generate.md?raw'
const caseStore = useCaseStore()
const casetemp = ref('')

function onSubmitCase() {
  chat.sendMessage({
    text: `${defaultCasePrompt}\n\n**要点设定**：${caseStore.case.tags.join('，')}\n\n**来源**：${Object.values(caseStore.case.source.content).join('，')}`,
  })
}
</script>
