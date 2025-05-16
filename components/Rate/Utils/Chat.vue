<template>
  <v-sheet class="d-flex flex-column ga-4 mx-4">
    <CommonChatFrame chat-type="rate" />
    <CommonVoiceCard />
    <CommonModelCard model-type="chat" model-usage="rate" />
    <CommonPromptCard usage="rate" />
    <CommonApiBaseUrlSelector />
  </v-sheet>
</template>
