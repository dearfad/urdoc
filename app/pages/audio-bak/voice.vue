<template>
  <v-sheet class="d-flex flex-column w-100 w-md-75 mx-auto my-4 px-2 ga-4">
    <VoiceUtilsGenerate />
    <VoiceUtilsGenerateDialogue />
    <ModelCard model-type="audio" />
  </v-sheet>
</template>

<script setup>
definePageMeta({
  title: '语音合成',
})
</script>
