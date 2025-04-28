<template>
  <v-sheet class="d-flex flex-column w-100 w-md-75 mx-auto py-2 ga-4 mx-4">
    <CommonRecordTools />
    <ActContentShow />
    <ActUtilsChat />
  </v-sheet>
</template>

<script setup>
definePageMeta({
  title: '问诊',
  layout: 'cstar',
})
</script>
