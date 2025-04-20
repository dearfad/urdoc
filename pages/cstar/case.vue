<template>
  <v-sheet class="d-flex flex-column w-100 w-md-75 mx-auto mb-16">
    <CaseContentTabs />
    <CaseUtilsGenerate />
  </v-sheet>
</template>

<script setup>
definePageMeta({
  title: '生成病例',
  layout: 'cstar',
})
</script>
