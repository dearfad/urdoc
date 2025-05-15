<template>
  <v-sheet class="d-flex flex-column ga-4 mx-4">
    <CommonGenerateButton generate-type="face" />
    <CommonModelCard model-type="chat" model-usage="face" />
    <CommonModelCard model-type="images" model-usage="face" />
    <CommonPromptCard usage="face" />
  </v-sheet>
</template>
