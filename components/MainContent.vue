<template>
    <v-main class="h-screen d-flex flex-column">
        <ShowCaseInfo />
        <ShowChatMessages v-if="chat" />
        <SendMessage v-if="chat" />
        <ShowInfo v-if="info" />
        <GenerateCase v-if="generate" />
    </v-main>
</template>

<script setup>
const stateStore = useStateStore()
const { currentContent } = storeToRefs(stateStore)
const chat = computed(() => (currentContent.value == 'chat' ? true : false))
const info = computed(() => (currentContent.value == 'info' ? true : false))
const generate = computed(() => (currentContent.value == 'generate' ? true : false))
</script>
