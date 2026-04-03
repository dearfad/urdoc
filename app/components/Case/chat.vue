<script setup lang="ts">
import type { UIMessage } from 'ai'
import { isReasoningUIPart, isTextUIPart, isToolUIPart, getToolName } from 'ai'
import { Chat } from '@ai-sdk/vue'
import { isToolStreaming } from '@nuxt/ui/utils/ai'

const input = ref('')

const chat = new Chat({
  onError(error) {
    console.error(error)
  },
})

function onSubmit() {
  chat.sendMessage({ text: input.value })

  input.value = ''
}
</script>

<template>
  <UChatMessages :messages="chat.messages" :status="chat.status">
    <template #content="{ message }">
      <template v-for="(part, index) in message.parts" :key="`${message.id}-${part.type}-${index}`">
        <UChatReasoning v-if="isReasoningUIPart(part)" :text="part.text" :streaming="true">
          <MDC :value="part.text" :cache-key="`reasoning-${message.id}-${index}`" class="*:first:mt-0 *:last:mb-0" />
        </UChatReasoning>

        <UChatTool v-else-if="isToolUIPart(part)" :text="getToolName(part)" :streaming="isToolStreaming(part)" />

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

  <UChatPrompt v-model="input" :error="chat.error" @submit="onSubmit">
    <UChatPromptSubmit :status="chat.status" @stop="chat.stop()" @reload="chat.regenerate()" />
  </UChatPrompt>
  <div>
    <UChatPromptSubmit :status="chat.status" @stop="chat.stop()" @reload="chat.regenerate()" @click="onSubmit" />
  </div>
</template>
