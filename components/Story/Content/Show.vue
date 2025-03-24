<template>
  <v-sheet
    class="text-body-1 pa-5 mx-4 my-2 overflow-auto"
    elevation="4"
    rounded="lg"
    height="60vh"
  >
    <div v-if="!caseStore.caseStoryMarkdown && stateStore.isModelResponseStringShow">
      {{ stateStore.modelResponseString }}
    </div>
    <MDC :value="caseStore.caseStoryMarkdown" />
  </v-sheet>
</template>

<script setup>
const stateStore = useStateStore()
const caseStore = useCaseStore()
</script>
