<template>
  <v-sheet class="d-flex flex-column w-100 w-md-75 mx-auto py-4 ga-4">
    <CommonRecordTools />
    <CaseContentShow />
    <CaseUtilsGenerate />
  </v-sheet>
</template>

<script setup>
definePageMeta({
  title: '生成病例',
  layout: 'cstar',
})
</script>
