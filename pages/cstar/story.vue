<template>
  <v-sheet class="d-flex flex-column w-100 w-md-75 mx-auto mb-16">
    <StoryContentShow />
    <StoryUtilsCreate />
  </v-sheet>
</template>

<script setup>
definePageMeta({
  title: '编写故事',
  layout: 'cstar',
})
</script>
