<template>
  <v-card class="text-body-1 px-4 py-2 overflow-auto" rounded="lg" :height="height" elevation="4">
    <div v-if="stateStore.isCaseModelResponseStringShow">
      <div v-if="stateStore.modelResponseString.reasoning_content" class="px-4">
        <details open>
          <summary>🤔 思考过程</summary>
          <MDC :value="stateStore.modelResponseString.reasoning_content" />
        </details>
      </div>
      <MDC :value="`${stateStore.modelResponseString.content}`" />
    </div>
    <div v-else>
      <MDC :value="recordStore.view.case.markdown" />
    </div>
  </v-card>
</template>

<script setup>
const recordStore = useRecordStore()
const stateStore = useStateStore()
const { height } = defineProps({
  height: { type: String, default: '55vh', required: false },
})
</script>
