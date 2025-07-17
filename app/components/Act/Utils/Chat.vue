<template>
  <v-sheet class="d-flex flex-column ga-4 mx-4">
    <CommonChatFrame chat-type="act" />
    <CommonVoiceCard />
    <CommonModelCard model-type="chat" model-usage="act" />
    <CommonPromptCard usage="act" />
    <CommonApiBaseUrlSelector />
  </v-sheet>
</template>
