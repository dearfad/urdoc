<template>
  <v-card class="text-body-1 px-4 py-2 overflow-auto" rounded="lg" :height="height" elevation="4">
    <div v-if="stateStore.isCaseModelResponseStringShow">
      <div v-if="modelStore.modelResponse.reasoning_content" class="px-4">
        <details open>
          <summary>🤔 思考过程</summary>
          <MDC :value="modelStore.modelResponse.reasoning_content" />
        </details>
      </div>
      <MDC :value="`${caseMarkdown}`" />
    </div>
    <div v-else>
      <MDC :value="recordStore.view.case.markdown" />
    </div>
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
  console.log(modelStore.modelResponse.content)
  return Object.entries(modelStore.modelResponse.content)
    .map(([key, value]) => `**${key}**: ${value}`)
    .join('\n\n')
})
</script>
