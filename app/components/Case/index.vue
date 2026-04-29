<template>
  <UCard
    id="component-case-index"
    :ui="{
      root: 'border border-default overflow-auto',
      header: 'bg-elevated flex items-center py-2 ',
      body: 'py-0 sm:py-2',
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
      <UButton icon="i-mdi-alpha-c-circle" variant="ghost" to="/cstar/case" />
      <span class="font-bold">病历</span>
      <div class="ms-auto flex gap-2">
        <ButtonCapture capture-id="component-case-index" />
        <UButton icon="i-lucide-file-volume" variant="ghost" />
        <CaseGenerate />
      </div>
    </template>

    <template #default>
      <!-- <MDC :value="content" :key="content" cache-key="case-chat-content-show" /> -->
      <!-- <MarkdownRender :content="content" custom-id="case-content" /> -->
      <ClientOnly>
        <UChatReasoning :text="caseStore.case.reasoning" defaultOpen :ui="{ body: 'max-h-none pt-0' }" />
        <Comark :markdown="content" />
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
          v-for="sourceItem in filteredTextbookItems"
          :key="sourceItem"
          :icon="sourceItem.icon"
          variant="soft"
          color="neutral"
          size="lg"
        >
          {{ caseStore.case.textbook?.content?.[sourceItem.name] }}
        </UBadge>
        <UBadge
          v-for="custom in caseStore.case.custom"
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
// import MarkdownRender from 'markstream-vue'
import { parse } from 'partial-json'
import CaptureButton from '../Button/Capture.vue'
const caseStore = useCaseStore()
const content = computed(() => {
  if (!caseStore.case?.content) return ''
  if (typeof caseStore.case.content === 'string') return
  const raw = JSON.stringify(caseStore.case.content)
  return Object.entries(parse(raw))
    .map(([key, value]) => `**${key}**：${value}`)
    .join('\n\n')
})

const textbookItems = ref([
  { icon: 'i-lucide-book', name: 'book' },
  { icon: 'i-lucide-bookmark', name: 'part' },
  { icon: 'i-lucide-table-of-contents', name: 'chapter' },
  { icon: 'i-lucide-book-marked', name: 'section' },
  { icon: 'i-lucide-book-open', name: 'subsection' },
  { icon: 'i-lucide-notepad-text', name: 'topic' },
])

const filteredTextbookItems = computed(() => {
  return textbookItems.value.filter((item) => caseStore.case.textbook?.content?.[item.name])
})

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
