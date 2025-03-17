<template>
  <v-sheet class="border-thin text-body-1 pa-4 mx-2">
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
