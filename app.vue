<template>
  <v-app>
    <AppBar />
    <AppFooter />
    <MainContent />
  </v-app>
</template>

<script setup>
callOnce(() => {
  const messageStore = useMessageStore()
  const { addMessage } = messageStore
  const promptStore = usePromptStore()
  const { simSysPrompt } = storeToRefs(promptStore)
  addMessage({ role: 'system', content: simSysPrompt.value })
})
</script>
