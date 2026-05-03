<template>
  <UCard
    id="component-story-index"
    :ui="{
      root: 'border border-default overflow-auto flex flex-col',
      header: 'bg-elevated flex items-center py-2 ',
      body: 'py-0 sm:py-2 flex-1',
      footer: 'p-0 sm:p-0',
    }"
  >
    <!-- 
      <v-btn
        :icon="isReasoningContentShow ? mdiHeadCogOutline : mdiHeadMinusOutline"
        @click="isReasoningContentShowSwitches = !isReasoningContentShowSwitches"
      />
      <CommonAudioButton audio-type="case" />
      <CommonCaptureButton capture-id="case-card" /> 
    -->

    <template #header>
      <UButton icon="i-mdi-alpha-s-circle" variant="ghost" to="/cstar/story" />
      <span class="font-bold">故事</span>
      <div class="ms-auto flex gap-2">
        <ButtonCapture capture-id="component-story-index" />
        <UButton icon="i-lucide-file-volume" variant="ghost" />
        <StoryGenerate />
      </div>
    </template>

    <template #default>
      <!-- <MDC :value="content" :key="content" cache-key="case-chat-content-show" /> -->
      <!-- <MarkdownRender :content="content" custom-id="case-content" /> -->
      <ClientOnly>
        <UChatReasoning :text="storyStore.story.reasoning" defaultOpen :ui="{ body: 'max-h-none pt-0' }" class="pt-2" />
        <Comark :markdown="storyStore.story.content" />
      </ClientOnly>

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

    <template #footer>
      <div class="mx-4 my-2 flex flex-wrap gap-2">
        <UBadge
          v-for="custom in storyStore.story.custom"
          :key="custom"
          variant="soft"
          color="neutral"
          size="lg"
          icon="i-lucide-pencil"
        >
          {{ custom }}
        </UBadge>
      </div>
    </template>
  </UCard>
</template>

<script setup>
const storyStore = useStoryStore()

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
