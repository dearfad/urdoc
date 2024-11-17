<template>
    <v-app>
        <AppBar />
        <AppFooter />
        <MainContent />
    </v-app>
</template>

<script setup>
import { useStateStore } from './stores/state'

callOnce(() => {
    const messageStore = useMessageStore()
    const { addMessage } = messageStore
    const promptStore = usePromptStore()
    const { simSysPrompt } = storeToRefs(promptStore)
    addMessage({ role: 'system', content: simSysPrompt.value })

    const stateStore = useStateStore()
    const { currentContent } = storeToRefs(stateStore)
    currentContent.value = 'info'
})
</script>
