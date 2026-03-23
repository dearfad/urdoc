<template>
  <v-card id="case-card" rounded="lg" hover min-height="400">
    <v-toolbar density="comfortable">
      <template #prepend>
        <v-btn :icon="mdiAlphaCCircle" to="/cstar/case" variant="plain" />
      </template>
      <v-toolbar-title class="font-weight-bold ml-0" text="病历" />
      <template #append>
        <v-btn
          :icon="isReasoningContentShow ? mdiHeadCogOutline : mdiHeadMinusOutline"
          @click="isReasoningContentShowSwitches = !isReasoningContentShowSwitches"
        />
        <CommonAudioButton audio-type="case" />
        <CommonCaptureButton capture-id="case-card" />
      </template>
    </v-toolbar>
    <v-card-text>
      <div v-if="isReasoningContentShow" class="reasoning my-4">
        <details open>
          <summary class="font-weight-bold">思考过程</summary>
          <v-divider class="my-2" />
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
    </v-card-text>
  </v-card>
</template>

<script setup>
import MarkdownRender from 'markstream-vue'
import 'markstream-vue/index.css'

import { mdiAlphaCCircle, mdiHeadCogOutline, mdiHeadMinusOutline } from '@mdi/js'

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
