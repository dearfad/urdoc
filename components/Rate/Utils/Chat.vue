<template>
  <v-sheet class="d-flex flex-column ga-4 mx-4">
    <CommonChatFrame chat-type="rate" />
    <CommonModelSelector model-type="chat" model-usage="rate" />
    <CommonPromptSelector model-type="chat" model-usage="rate" />
    <CommonApiBaseUrlSelector />
  </v-sheet>
</template>
