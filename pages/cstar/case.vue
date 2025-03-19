<template>
  <v-sheet class="d-flex flex-column w-100 w-md-75 mx-auto">
    <!-- <CommonCaseNavCard /> -->
    <CaseContentShow />
    <CaseUtilsCreate />
    <CommonBottomNavgation />
    <!-- <CaseUtilsTabs /> -->
  </v-sheet>
</template>

<script setup>
definePageMeta({
  title: '生成病例',
})
</script>
