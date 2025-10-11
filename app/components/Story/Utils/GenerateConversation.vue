<template>
  <div class="d-flex flex-column ga-4">
    <CommonGenerateButton generate-type="conversation" />
    <CommonTagInput tag-type="story" />
    <ModelCard model-type="chat" model-usage="story" />
    <CommonPromptCard usage="story" />
  </div>
</template>
