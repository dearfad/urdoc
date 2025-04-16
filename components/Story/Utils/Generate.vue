<template>
  <v-sheet class="d-flex flex-column mx-4">
    <CommonGenerateButton generate-type="story" />
    <CommonCustomConfig config-type="story" />
    <CommonModelSelector model-type="chat" model-usage="story" />
    <CommonPromptSelector model-type="chat" model-usage="story" />
    <CommonApiBaseUrlSelector />
  </v-sheet>
</template>
