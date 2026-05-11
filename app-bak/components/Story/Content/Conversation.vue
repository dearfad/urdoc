<template>
  <v-card id="conversation-card" rounded="lg" hover min-height="400">
    <v-toolbar density="comfortable">
      <template #prepend>
        <v-btn :icon="mdiAlphaCCircle" to="/cstar/story" variant="plain" />
      </template>
      <v-toolbar-title class="font-weight-bold ml-0" text="对话" />
      <template #append>
        <v-btn
          :icon="isReasoningContentShow ? mdiHeadCogOutline : mdiHeadMinusOutline"
          @click="isReasoningContentShowSwitches = !isReasoningContentShowSwitches"
        />
        <CommonCaptureButton capture-id="conversation-card" />
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
      <div v-if="stateStore.isModelResponseShow.conversation" class="conversation">
        <MarkdownRender :content="modelStore.modelResponse.chat.content" />
      </div>
      <div v-else class="conversation">
        <MarkdownRender :content="recordStore.view.conversation" />
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
import MarkdownRender from 'markstream-vue'
import { mdiAlphaCCircle, mdiHeadCogOutline, mdiHeadMinusOutline } from '@mdi/js'
const stateStore = useStateStore()
const modelStore = useModelStore()
const recordStore = useRecordStore()

// 是否显示思考过程
const isReasoningContentShowSwitches = ref(true)
const isReasoningContentShow = computed(
  () =>
    (stateStore.isModelResponseShow.conversation &&
      modelStore.modelResponse.chat.reasoning_content) ||
    (isReasoningContentShowSwitches.value && recordStore.record.reasoning.conversation)
)

// 思考内容
const reasoningContent = computed(
  () => recordStore.record.reasoning.conversation || modelStore.modelResponse.chat.reasoning_content
)
</script>
