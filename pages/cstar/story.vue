<template>
  <v-sheet class="d-flex flex-column w-100 w-md-75 mx-auto py-2 ga-4">
    <CommonRecordTools />
    <StoryContentShow />
    <StoryUtilsGenerate />
  </v-sheet>
</template>

<script setup>
import { StoryUtilsGenerate } from '#components'

definePageMeta({
  title: '编写故事',
  layout: 'cstar',
})
</script>
