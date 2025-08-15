<template>
  <div class="d-flex flex-column w-100 w-md-75 mx-auto my-4 px-2 ga-4">
    <CommonRecordTools />
    <StoryContentShow />
    <StoryUtilsGenerate />
  </div>
</template>

<script setup>
import { StoryUtilsGenerate } from '#components'

definePageMeta({
  title: '故事',
  layout: 'cstar',
})
</script>
