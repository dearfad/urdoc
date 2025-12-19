<template>
  <v-card id="comment-card" rounded="lg" hover min-height="400">
    <v-toolbar density="comfortable">
      <template #prepend>
        <v-btn :icon="mdiCommentOutline" to="/cstar/story" variant="plain" />
      </template>
      <v-toolbar-title class="font-weight-bold ml-0" text="评语" />
      <template #append>
        <v-btn
          :icon="isReasoningContentShow ? mdiHeadCogOutline : mdiHeadMinusOutline"
          @click="isReasoningContentShowSwitches = !isReasoningContentShowSwitches"
        />
        <CommonCaptureButton capture-id="comment-card" />
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
      <div v-if="stateStore.isModelResponseShow.comment" class="comment">
        <MarkdownRender :content="modelStore.modelResponse.chat.content" />
      </div>
      <div v-else class="comment">
        <MarkdownRender :content="recordStore.view.comment" />
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { mdiCommentOutline, mdiHeadMinusOutline, mdiHeadCogOutline } from '@mdi/js'
import MarkdownRender from 'markstream-vue'
const stateStore = useStateStore()
const modelStore = useModelStore()
const recordStore = useRecordStore()

// 是否显示思考过程
const isReasoningContentShowSwitches = ref(true)
const isReasoningContentShow = computed(
  () =>
    (stateStore.isModelResponseShow.comment && modelStore.modelResponse.chat.reasoning_content) ||
    (isReasoningContentShowSwitches.value && recordStore.record.reasoning.comment)
)

// 思考内容
const reasoningContent = computed(
  () => recordStore.record.reasoning.comment || modelStore.modelResponse.chat.reasoning_content
)
</script>
