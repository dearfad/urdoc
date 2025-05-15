<template>
  <v-sheet class="d-flex flex-column w-100 w-md-75 mx-auto py-4 ga-4">
    <PoseContentShow />
    <PoseContentPrompt />
    <PoseUtilsGet />
    <PoseUtilsGenerate />
  </v-sheet>
</template>

<script setup>
definePageMeta({
  title: '视频生成',
})
</script>
