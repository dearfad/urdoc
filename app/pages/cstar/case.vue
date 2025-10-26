<template>
  <div class="d-flex flex-column w-100 w-md-75 mx-auto my-4 px-2 ga-4">
    <!-- <CommonRecordTools /> -->
    <CaseContentShow />
    <CaseUtilsGenerate />
    <!-- <CaseUtilsCheck /> -->
  </div>
</template>

<script setup>
definePageMeta({
  title: '生成病例',
})
</script>
