<template>
  <v-sheet class="d-flex flex-column w-100 w-md-75 mx-auto my-4 px-2 ga-4">
    <PoseContentShow />
    <PoseContentPrompt />
    <PoseUtilsGenerate />
  </v-sheet>
</template>

<script setup>
definePageMeta({
  title: '视频生成',
})
</script>
