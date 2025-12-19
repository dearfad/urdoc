<template>
  <v-card id="story-card" rounded="lg" hover min-height="400">
    <v-toolbar density="comfortable">
      <template #prepend>
        <v-btn :icon="mdiAlphaSCircle" to="/cstar/story" variant="plain" />
      </template>
      <v-toolbar-title class="font-weight-bold ml-0" text="故事" />
      <template #append>
        <v-btn
          :icon="isReasoningContentShow ? mdiHeadCogOutline : mdiHeadMinusOutline"
          @click="isReasoningContentShowSwitches = !isReasoningContentShowSwitches"
        />
        <CommonCaptureButton capture-id="story-card" />
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
      <div v-if="stateStore.isModelResponseShow.story" class="story">
        <MarkdownRender :content="modelStore.modelResponse.chat.content" />
      </div>
      <div v-else class="story">
        <MarkdownRender :content="recordStore.view.story.markdown" />
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
import MarkdownRender from 'markstream-vue'
import { mdiAlphaSCircle, mdiHeadCogOutline, mdiHeadMinusOutline } from '@mdi/js'
const stateStore = useStateStore()
const modelStore = useModelStore()
const recordStore = useRecordStore()

// 是否显示思考过程
const isReasoningContentShowSwitches = ref(true)
const isReasoningContentShow = computed(
  () =>
    (stateStore.isModelResponseShow.story && modelStore.modelResponse.chat.reasoning_content) ||
    (isReasoningContentShowSwitches.value && recordStore.record.reasoning.story)
)

// 思考内容
const reasoningContent = computed(
  () => recordStore.record.reasoning.story || modelStore.modelResponse.chat.reasoning_content
)
</script>
