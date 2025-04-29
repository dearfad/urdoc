<template>
  <v-sheet class="d-flex flex-column ga-4 mx-4">
    <CommonGenerateButton generate-type="story" />
    <CommonTagInput tag-type="story" />
    <CommonModelSelector model-type="chat" model-usage="story" />
    <CommonPromptSelector model-type="chat" model-usage="story" />
    <CommonApiBaseUrlSelector />
  </v-sheet>
</template>
