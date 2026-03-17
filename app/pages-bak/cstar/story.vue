<template>
  <v-sheet class="d-flex flex-column w-100 w-md-66 mx-auto my-4 px-2 ga-4">
    <!-- <CommonRecordTools /> -->
    <StoryContentShow />
    <StoryUtilsGenerate />
    <StoryContentConversation />
    <StoryUtilsGenerateConversation />
    <StoryContentDiscussion />
    <StoryUtilsGenerateDiscussion />
    <StoryContentComment />
    <StoryUtilsGenerateComment />
  </v-sheet>
</template>

<script setup>
definePageMeta({
  title: '编写故事',
})
</script>
