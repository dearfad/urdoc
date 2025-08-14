<template>
  <v-card hover class="text-body-1 px-5 py-2 overflow-auto" rounded="lg" height="55vh">
    <div v-if="stateStore.isModelResponseStringShow">
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
</script>
