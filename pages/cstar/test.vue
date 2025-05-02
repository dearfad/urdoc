<template>
  <v-sheet class="d-flex flex-column w-100 w-md-75 mx-auto py-4 ga-4">
    <CommonRecordTools />
    <TestContentShow />
    <TestUtilsGenerate />
  </v-sheet>
</template>

<script setup>
definePageMeta({
  title: '测试问题',
  layout: 'cstar',
})
</script>
