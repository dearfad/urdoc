<template>
  <v-sheet class="d-flex flex-column ga-4 mx-4">
    <CommonGenerateButton generate-type="case" />
    <CommonTagInput tag-type="case" />
    <CommonScopeSelector />
    <CommonModelSelector model-type="chat" model-usage="case" />
    <CommonPromptSelector model-type="chat" model-usage="case" />
    <CommonApiBaseUrlSelector />
  </v-sheet>
</template>
