<template>
  <v-sheet class="d-flex flex-column">
    <CommonCaseNavCard />
    <ActContentShow />
    <ActUtilsSend />
  </v-sheet>
</template>

<script setup>
definePageMeta({
  title: '问诊',
  layout: 'cstar',
})
</script>
