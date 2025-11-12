<template>
  <v-card rounded="lg" hover min-height="400">
    <v-card-item class="bg-surface-light">
      <template #prepend>
        <v-icon icon="mdi-comment-outline" />
      </template>
      <template #append>
        <v-icon
          :icon="isReasoningContentShow ? 'mdi-head-cog-outline' : 'mdi-head-minus-outline'"
          @click="isReasoningContentShowSwitches = !isReasoningContentShowSwitches"
        />
      </template>
      <v-card-title class="font-weight-bold">评语</v-card-title>
    </v-card-item>
    <v-divider />
    <v-card-text>
      <div v-if="isReasoningContentShow" class="reasoning my-4">
        <details open>
          <summary class="font-weight-bold">思考过程</summary>
          <v-divider class="my-2" />
          <MDC cache-key="comment-chat-reasoning-content-show" :value="reasoningContent" />
          <v-divider class="my-2" />
        </details>
      </div>
      <div v-if="stateStore.isModelResponseShow.comment" class="comment">
        <MDC cache-key="comment-chat-content-show" :value="modelStore.modelResponse.chat.content" />
      </div>
      <div v-else class="comment">
        <MDC cache-key="record-comment-show" :value="recordStore.view.comment" />
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
const stateStore = useStateStore()
const modelStore = useModelStore()
const recordStore = useRecordStore()

// 是否显示思考过程
const isReasoningContentShowSwitches = ref(true)
const isReasoningContentShow = computed(
  () =>
    (stateStore.isModelResponseShow.discussion &&
      modelStore.modelResponse.chat.reasoning_content) ||
    (isReasoningContentShowSwitches.value && recordStore.record.reasoning.comment)
)

// 思考内容
const reasoningContent = computed(
  () => recordStore.record.reasoning.comment || modelStore.modelResponse.chat.reasoning_content
)
</script>
