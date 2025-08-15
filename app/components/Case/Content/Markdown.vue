<template>
  <v-card class="text-body-1 px-4 py-2 overflow-auto" rounded="lg" :height="height" elevation="4">
    <div v-if="stateStore.isCaseModelResponseStringShow">
      {{ stateStore.modelResponseString }}
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
