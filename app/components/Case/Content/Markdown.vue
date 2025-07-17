<template>
  <v-sheet
    class="text-body-1 px-5 py-2 overflow-auto mx-4"
    elevation="4"
    rounded="lg"
    height="55vh"
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
