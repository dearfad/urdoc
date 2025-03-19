<template>
  <v-sheet class="d-flex flex-column">
    <CommonCaseNavCard />
    <TestContentShow />
    <TestUtilsCreate />
  </v-sheet>
</template>

<script setup>
definePageMeta({
  title: '测试问题',
  layout: 'cstar',
})
</script>
