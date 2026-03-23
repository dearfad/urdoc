<template>
  <v-card id="discussion-card" rounded="lg" hover min-height="400">
    <v-toolbar density="comfortable">
      <template #prepend>
        <v-btn :icon="mdiDisc" to="/cstar/story" variant="plain" />
      </template>
      <v-toolbar-title class="font-weight-bold ml-0" text="讨论" />
      <template #append>
        <v-btn
          :icon="isReasoningContentShow ? mdiHeadCogOutline : mdiHeadMinusOutline"
          @click="isReasoningContentShowSwitches = !isReasoningContentShowSwitches"
        />
        <CommonCaptureButton capture-id="discussion-card" />
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
      <div v-if="stateStore.isModelResponseShow.discussion" class="discussion">
        <MarkdownRender :content="modelStore.modelResponse.chat.content" />
      </div>
      <div v-else class="discussion">
        <MarkdownRender :content="recordStore.view.discussion" />
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
import MarkdownRender from 'markstream-vue'
import { mdiDisc, mdiHeadCogOutline, mdiHeadMinusOutline } from '@mdi/js'
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
