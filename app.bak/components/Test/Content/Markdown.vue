<template>
  <v-card rounded="lg" hover min-height="400">
    <v-toolbar density="comfortable">
      <template #prepend>
        <v-btn icon="mdi-alpha-t-circle" to="/cstar/test" variant="plain" />
      </template>
      <v-toolbar-title class="font-weight-bold ml-0" text="测试" />
      <template #append>
        <v-btn
          :icon="isReasoningContentShow ? 'mdi-head-cog-outline' : 'mdi-head-minus-outline'"
          @click="isReasoningContentShowSwitches = !isReasoningContentShowSwitches"
        />
        <v-btn icon="mdi-cog-outline" />
      </template>
    </v-toolbar>

    <!-- <v-divider /> -->
    <v-card-text>
      <div v-if="isReasoningContentShow" class="reasoning my-4">
        <details open>
          <summary class="font-weight-bold">思考过程</summary>
          <v-divider class="my-2" />
          <MDC cache-key="test-chat-reasoning-content-show" :value="reasoningContent" />
          <v-divider class="my-2" />
        </details>
      </div>

      <div v-if="stateStore.isModelResponseShow.test" class="test">
        <MDC cache-key="test-chat-content-show" :value="streamChatContentMarkdown" />
      </div>
      <div v-else class="test">
        <MDC cache-key="record-test-markdown-show" :value="recordStore.view.test.markdown" />
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
    (stateStore.isModelResponseShow.test && modelStore.modelResponse.chat.reasoning_content) ||
    (isReasoningContentShowSwitches.value && recordStore.record.reasoning.test)
)

// 思考内容
const reasoningContent = computed(
  () => recordStore.record.reasoning.test || modelStore.modelResponse.chat.reasoning_content
)
</script>
