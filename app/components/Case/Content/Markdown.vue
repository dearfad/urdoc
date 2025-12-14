<template>
  <v-card rounded="lg" hover min-height="400">
    <v-toolbar density="comfortable">
      <template #prepend>
        <v-btn icon="mdi-alpha-c-circle" to="/cstar/case" variant="plain" />
      </template>
      <v-toolbar-title class="font-weight-bold ml-0" text="病历" />
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
          <!-- <MDC cache-key="case-chat-reasoning-content-show" :value="reasoningContent" /> -->
          <MarkdownRender :content="reasoningContent" />
          <v-divider class="my-2" />
        </details>
      </div>

      <div v-if="stateStore.isModelResponseShow.case" class="case">
        <MarkdownRender :content="streamChatContentMarkdown" />
      </div>
      <div v-else class="case">
        <MarkdownRender :content="recordStore.view.case.markdown" />
      </div>
      <!-- 
      <div v-if="stateStore.isModelResponseShow.case" class="case">
        <MDC cache-key="case-chat-content-show" :value="streamChatContentMarkdown" />
      </div>
      <div v-else class="case">
        <MDC cache-key="record-case-markdown-show" :value="recordStore.view.case.markdown" />
      </div> -->
    </v-card-text>
  </v-card>
</template>

<script setup>
import MarkdownRender from 'markstream-vue'
import 'markstream-vue/index.css'

const recordStore = useRecordStore()
const stateStore = useStateStore()
const modelStore = useModelStore()

// 是否显示思考过程
const isReasoningContentShowSwitches = ref(true)
const isReasoningContentShow = computed(
  () =>
    (stateStore.isModelResponseShow.case && modelStore.modelResponse.chat.reasoning_content) ||
    (isReasoningContentShowSwitches.value && recordStore.record.reasoning.case)
)

// 思考内容
const reasoningContent = computed(
  () => recordStore.record.reasoning.case || modelStore.modelResponse.chat.reasoning_content
)

// 是否显示流式内容
const streamChatContentMarkdown = computed(() => {
  return Object.entries(modelStore.modelResponse.chat.content)
    .map(([key, value]) => `**${key}**：${value}`)
    .join('\n\n')
})
</script>
