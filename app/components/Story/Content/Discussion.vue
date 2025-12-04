<template>
  <v-card rounded="lg" hover min-height="400">
    <v-card-item class="bg-surface-light">
      <template #prepend>
        <v-icon icon="mdi-disc" />
      </template>
      <template #append>
        <v-icon
          :icon="isReasoningContentShow ? 'mdi-head-cog-outline' : 'mdi-head-minus-outline'"
          @click="isReasoningContentShowSwitches = !isReasoningContentShowSwitches"
        />
      </template>
      <v-card-title class="font-weight-bold">讨论</v-card-title>
    </v-card-item>
    <v-divider />
    <v-card-text>
      <div v-if="isReasoningContentShow" class="reasoning my-4">
        <details open>
          <summary class="font-weight-bold">思考过程</summary>
          <v-divider class="my-2" />
          <!-- <MDC cache-key="discussion-chat-reasoning-content-show" :value="reasoningContent" /> -->
          <MarkdownRender :content="reasoningContent" />
          <v-divider class="my-2" />
        </details>
      </div>
      <div v-if="stateStore.isModelResponseShow.discussion" class="discussion">
        <!-- <MDC
          cache-key="discussion-chat-content-show"
          :value="modelStore.modelResponse.chat.content"
        /> -->
        <MarkdownRender :content="modelStore.modelResponse.chat.content" />
      </div>
      <div v-else class="discussion">
        <div v-for="(line, index) in recordStore.view.discussion.split('\n\n')" :key="index">
          <!-- <MDC :value="line" /> -->
          <MarkdownRender :content="line" />
          <v-divider v-if="(index + 1) % 2 === 0" class="my-2" />
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
import MarkdownRender from 'markstream-vue'
const stateStore = useStateStore()
const modelStore = useModelStore()
const recordStore = useRecordStore()

// 是否显示思考过程
const isReasoningContentShowSwitches = ref(true)
const isReasoningContentShow = computed(
  () =>
    (stateStore.isModelResponseShow.discussion &&
      modelStore.modelResponse.chat.reasoning_content) ||
    (isReasoningContentShowSwitches.value && recordStore.record.reasoning.discussion)
)

// 思考内容
const reasoningContent = computed(
  () => recordStore.record.reasoning.discussion || modelStore.modelResponse.chat.reasoning_content
)
</script>
