<template>
  <v-sheet
    class="text-body-1 pa-5 mx-4 my-2 overflow-auto"
    elevation="4"
    rounded="lg"
    height="60vh"
  >
    <div v-if="!caseStore.caseTestMarkdown">
      {{ stateStore.modelResponseString }}
    </div>
    <MDC :value="caseStore.caseTestMarkdown" />
  </v-sheet>
</template>

<script setup>
const caseStore = useCaseStore()
const stateStore = useStateStore()
</script>
