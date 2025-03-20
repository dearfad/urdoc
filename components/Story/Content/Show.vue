<template>
  <v-sheet class="text-body-1 pa-4 mx-4 my-2" elevation="4" rounded="lg" min-height="60vh">
    <div v-if="!caseStore.caseStoryMarkdown" class="pa-4">
      {{ stateStore.modelResponseString }}
    </div>
    <MDC :value="caseStore.caseStoryMarkdown" />
  </v-sheet>
</template>

<script setup>
const stateStore = useStateStore()
const caseStore = useCaseStore()
</script>
