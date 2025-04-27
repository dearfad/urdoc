<template>
  <v-sheet
    class="text-body-1 px-5 py-2 mx-4 my-2 overflow-auto"
    elevation="4"
    rounded="lg"
    height="55vh"
  >
    <div v-if="stateStore.isModelResponseStringShow">
      {{ stateStore.modelResponseString }}
    </div>
    <div v-else>
      <p><MDC :value="recordStore.view.story.markdown" /></p>
    </div>
  </v-sheet>
</template>

<script setup>
const stateStore = useStateStore()
const recordStore = useRecordStore()
</script>

<style scoped>
p {
  text-indent: 2em;
}
</style>
