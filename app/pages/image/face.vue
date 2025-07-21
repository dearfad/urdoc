<template>
  <v-sheet class="d-flex flex-column w-100 w-md-75 mx-auto py-4 ga-4">
    <FaceContentShow />
    <CommonPutOSS />
    <FaceContentPrompt />
    <FaceUtilsGenerate />
  </v-sheet>
</template>

<script setup>
definePageMeta({
  title: '头像生成',
})
</script>
