<template>
  <v-sheet class="d-flex flex-column mx-4">
    <CommonGenerateButton generate-type="case" />
    <CommonCustomConfig config-type="case" />
    <CommonBookSelector />
    <CommonModelSelector model-type="chat" model-usage="case" />
    <CommonPromptSelector model-type="chat" model-usage="case" />
    <CommonApiBaseUrlSelector />
  </v-sheet>
</template>
