<template>
    <v-list class="chatMsgContainer flex-grow-1">
        <v-list-item
            v-for="(message, index) in messages.slice(1)"
            :key="index"
            :title="message.role == 'user' ? '医生' : simCaseJson['姓名'] + ':'"
        >
            <span class="font-weight-bold">{{ message.content }}</span>
        </v-list-item>
        <v-list-item class="chatMsgBottom" />
    </v-list>
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
