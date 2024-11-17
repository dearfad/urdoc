<template>
    <!-- <v-list class="catMsgContainer h-100 font-weight-bold flex-fill overflow-auto pa-1"> -->
    <v-sheet class="flex-grow-1">
        <v-list class="catMsgContainer" color="bg-grey-lighten-3">
            <v-list-item
                v-for="(message, index) in messages.slice(1)"
                :key="index"
                :title="message.role == 'user' ? '医生' : simCaseJson['姓名'] + ':'"
            >
                {{ message.content }}
            </v-list-item>
            <v-list-item class="chatMsgBottom" /> </v-list
    ></v-sheet>
</template>

<script setup>
const messageStore = useMessageStore()
const { messages } = storeToRefs(messageStore)
const caseStore = useCaseStore()
const { simCaseJson } = storeToRefs(caseStore)
const goTo = useGoTo()

messageStore.$subscribe(() => {
    nextTick(() => {
        goTo('.chatMsgBottom', { container: '.chatMsgContainer' })
    })
})
</script>
