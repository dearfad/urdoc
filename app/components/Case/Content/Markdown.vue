<template>
  <v-card class="overflow-auto" rounded="lg" :height="height" hover>
    <v-card-item class="bg-surface-light">
      <template #prepend>
        <v-icon icon="mdi-alpha-c-circle" />
      </template>
      <v-card-title class="font-weight-bold">病历</v-card-title>
    </v-card-item>
    <v-divider />
    <v-card-text class="text-body-1">
      <div v-if="stateStore.isCaseModelResponseStringShow" class="case">
        <div v-if="modelStore.modelResponse.chat.reasoning_content" class="px-4">
          <details open>
            <summary>🤔 思考过程</summary>
            <MDC :value="modelStore.modelResponse.chat.reasoning_content" />
          </details>
        </div>
        <MDC :value="caseMarkdown" />
      </div>
      <div class="case">
        <MDC :value="recordStore.view.case.markdown" />
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
const recordStore = useRecordStore()
const stateStore = useStateStore()
const modelStore = useModelStore()
const { height } = defineProps({
  height: { type: String, default: '55vh', required: false },
})

const caseMarkdown = computed(() => {
  return Object.entries(modelStore.modelResponse.chat.content)
    .map(([key, value]) => `**${key}**: ${value}`)
    .join('\n\n')
})
</script>
