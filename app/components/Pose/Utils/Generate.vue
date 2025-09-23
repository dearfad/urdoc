<template>
  <v-sheet class="d-flex flex-column ga-4">
    <CommonGenerateButton generate-type="pose" />
    <ModelCard model-type="chat" model-usage="pose" />
    <ModelCard model-type="video" model-usage="pose" />
    <CommonPromptCard usage="pose" />
  </v-sheet>
</template>
