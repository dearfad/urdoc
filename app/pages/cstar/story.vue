<template>
  <div class="d-flex flex-column w-100 w-md-75 mx-auto my-4 px-2 ga-4">
    <CommonRecordTools />
    <StoryContentShow />
    <StoryUtilsGenerate />
    <StoryContentConversation />
    <StoryUtilsGenerateConversation />
    <StoryContentDiscussion />
    <StoryUtilsGenerateDiscussion />
  </div>
</template>

<script setup>
definePageMeta({
  title: '编写故事',
  layout: 'cstar',
})
</script>
