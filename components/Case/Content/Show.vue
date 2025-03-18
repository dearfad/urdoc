<template>
  <v-sheet class="text-body-1 pa-4 mx-2 my-3" elevation="4" rounded="lg">
    <div v-if="!caseStore.caseContentMarkdown" class="pa-4">
      {{ stateStore.modelResponseString }}
    </div>
    <MDC :value="caseStore.caseContentMarkdown" />
  </v-sheet>
</template>

<script setup>
const caseStore = useCaseStore()
const stateStore = useStateStore()
</script>
