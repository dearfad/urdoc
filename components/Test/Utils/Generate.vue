<template>
  <v-sheet class="d-flex flex-column mx-4">
    <CommonGenerateButton generate-type="test" />
    <CommonTagInput tag-type="test" />
    <CommonModelSelector model-type="chat" model-usage="test" />
    <CommonPromptSelector model-type="chat" model-usage="test" />
    <CommonApiBaseUrlSelector />
  </v-sheet>
</template>
