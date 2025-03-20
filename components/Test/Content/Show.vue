<template>
  <v-sheet class="text-body-1 pa-4 mx-4 my-2" elevation="4" rounded="lg" min-height="60vh">
    <div v-if="!caseStore.caseTestMarkdown" class="pa-4">
      {{ stateStore.modelResponseString }}
    </div>
    <MDC :value="caseStore.caseTestMarkdown" />
  </v-sheet>
</template>

<script setup>
const caseStore = useCaseStore()
const stateStore = useStateStore()
</script>
