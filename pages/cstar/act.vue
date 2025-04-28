<template>
  <v-sheet class="d-flex flex-column w-100 w-md-75 mx-auto">
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
