<template>
  <v-sheet class="d-flex flex-column w-100 w-md-75 mx-auto mb-16">
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
