<template>
  <div class="d-flex flex-column w-100 w-md-75 mx-auto my-4 px-2 ga-4">
    <FaceContentShow />
    <!-- <CommonPutOSS /> -->
    <FaceContentPrompt />
    <FaceUtilsGenerate />
    <StoryUtilsGenerateIllustration />
    <StoryContentIllustration />
  </div>
</template>

<script setup>
definePageMeta({
  title: '头像生成',
})
</script>
