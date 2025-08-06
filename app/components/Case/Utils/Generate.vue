<template>
  <v-sheet class="d-flex flex-column ga-4 mx-4">
    <CommonGenerateButton generate-type="case" />
    <CommonTagInput tag-type="case" />
    <CommonScopeSelector />
    <CommonModelCard model-type="chat" model-usage="case" />
    <CommonPromptCard usage="case" />
  </v-sheet>
</template>
