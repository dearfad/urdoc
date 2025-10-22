<template>
  <v-card class="overflow-auto" rounded="lg" hover>
    <ClientOnly>
      {{ modelStore.modelResponse.chat.case }}
      <v-card-item class="bg-surface-light">
        <template #prepend>
          <v-icon icon="mdi-alpha-c-circle" />
        </template>
        <template #append>
          <v-icon
            :icon="isReasoningContentShow ? 'mdi-head-cog-outline' : 'mdi-head-minus-outline'"
            @click="isReasoningContentShowSwitches = !isReasoningContentShowSwitches"
          />
        </template>
        <v-card-title class="font-weight-bold">病历</v-card-title>
      </v-card-item>
      <v-divider />
      <v-card-text>
        <div v-if="isReasoningContentShow" class="reasoning my-4">
          <details open>
            <summary class="font-weight-bold">思考过程</summary>
            <v-divider class="my-2" />
            <MDC :value="reasoning" />
            <v-divider class="my-2" />
          </details>
        </div>

        <div v-if="stateStore.isModelResponseShow.case" class="case">
          <MDC :value="streamContentMarkdown" />
        </div>
        <div v-else class="case">
          <MDC :value="recordStore.view.case.markdown" />
        </div>
      </v-card-text>
    </ClientOnly>
  </v-card>
</template>

<script setup>
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
const reasoning = computed(
  () => recordStore.record.reasoning.case || modelStore.modelResponse.chat.reasoning_content
)

// 是否显示流式内容
const streamContentMarkdown = computed(() => {
  return Object.entries(modelStore.modelResponse.chat.content)
    .map(([key, value]) => `**${key}**: ${value}`)
    .join('\n\n')
})
</script>
