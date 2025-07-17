<template>
  <v-sheet class="d-flex flex-column ga-4 mx-4">
    <CommonGenerateButton generate-type="story" />
    <CommonTagInput tag-type="story" />
    <CommonModelCard model-type="chat" model-usage="story" />
    <CommonPromptCard usage="story" />
    <CommonApiBaseUrlSelector />
  </v-sheet>
</template>
