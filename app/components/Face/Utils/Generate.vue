<template>
  <v-sheet class="d-flex flex-column ga-4 mx-4">
    <CommonGenerateButton generate-type="face" />
    <ModelCard model-type="chat" model-usage="face" />
    <ModelCard model-type="image" model-usage="face" />
    <CommonPromptCard usage="face" />
  </v-sheet>
</template>
