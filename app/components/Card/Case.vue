<template>
  <UCard id="component-card-case" :ui="{ header: 'flex items-center py-2' }">
    <!-- 
      <v-btn
        :icon="isReasoningContentShow ? mdiHeadCogOutline : mdiHeadMinusOutline"
        @click="isReasoningContentShowSwitches = !isReasoningContentShowSwitches"
      />
      <CommonAudioButton audio-type="case" />
      <CommonCaptureButton capture-id="case-card" /> 
    -->

    <template #header>
      <UButton icon="i-mdi-alpha-c-circle" variant="ghost" to="/cstar/case" />
      <span class="font-bold">病历</span>
      <div class="flex ms-auto gap-2">
        <UButton icon="i-lucide-camera" variant="ghost" />
        <UButton icon="i-lucide-file-volume" variant="ghost" />
      </div>
    </template>

    <template #default>
      <MDC :value="md" />

      <!-- 
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
      -->
    </template>
  </UCard>
</template>

<script setup lang="ts">
// import MarkdownRender from 'markstream-vue'

const md = `# 生成病例\n\n这是 **加粗** 的文本。`

// import { mdiAlphaCCircle, mdiHeadCogOutline, mdiHeadMinusOutline } from '@mdi/js'

// const recordStore = useRecordStore()
// const stateStore = useStateStore()
// const modelStore = useModelStore()

// 是否显示思考过程
// const isReasoningContentShowSwitches = ref(true)
// const isReasoningContentShow = computed(
//   () =>
//     (stateStore.isModelResponseShow.case && modelStore.modelResponse.chat.reasoning_content) ||
//     (isReasoningContentShowSwitches.value && recordStore.record.reasoning.case),
// )

// 思考内容
// const reasoningContent = computed(
//   () => recordStore.record.reasoning.case || modelStore.modelResponse.chat.reasoning_content,
// )

// 是否显示流式内容
// const streamChatContentMarkdown = computed(() => {
//   return Object.entries(modelStore.modelResponse.chat.content)
//     .map(([key, value]) => `**${key}**：${value}`)
//     .join('\n\n')
// })
</script>
