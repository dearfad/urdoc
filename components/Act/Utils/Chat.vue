<template>
  <v-sheet class="d-flex flex-column ga-4 mx-4">
    <CommonChatFrame chat-type="act" />
    <CommonModelSelector model-type="chat" model-usage="act" />
    <CommonPromptSelector model-type="chat" model-usage="act" />
    <CommonApiBaseUrlSelector />
  </v-sheet>
</template>
