<template>
  <v-sheet
    class="text-body-1 pa-5 mx-4 my-2 overflow-auto"
    elevation="4"
    rounded="lg"
    height="60vh"
  >
    <div v-if="stateStore.isModelResponseStringShow">
      {{ stateStore.modelResponseString }}
    </div>
    <div v-else>
      <MDC :value="recordStore.view.case.markdown" />
    </div>
  </v-sheet>
</template>

<script setup lang="ts">
const recordStore = useRecordStore()
const stateStore = useStateStore()
</script>
