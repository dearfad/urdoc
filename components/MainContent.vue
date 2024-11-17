<template>
    <v-main class="h-screen d-flex flex-column">
        <v-sheet>
            <ShowCaseInfo />
        </v-sheet>
        <v-sheet
            v-if="chat"
            class="flex-grow-1 bg-red-lighten-3 d-flex flex-column-reverse justify-end"
        >
            <SendMessage />
            <ShowChatMessages />
        </v-sheet>
        <v-sheet v-if="info" class="flex-grow-1 bg-grey-lighten-3">
            <ShowInfo />
        </v-sheet>
    </v-main>
</template>

<script setup>
const stateStore = useStateStore()
const { currentContent } = storeToRefs(stateStore)
const chat = computed(() => (currentContent.value == 'chat' ? true : false))
const info = computed(() => (currentContent.value == 'info' ? true : false))
</script>
