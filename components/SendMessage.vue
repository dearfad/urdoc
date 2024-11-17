<template>
    <v-sheet>
        <v-text-field
            ref="inputPrompt"
            v-model="prompt"
            hide-details
            autofocus
            clearable
            :loading="isReceiving"
            :disabled="isReceiving"
            variant="solo"
            label="请输入"
            :append-inner-icon="appendIconInputPrompt"
            @keyup.enter="sendPrompt"
            @click:append-inner="setMsgWatcher"
        />
    </v-sheet>
</template>

<script setup>
const inputPrompt = useTemplateRef('inputPrompt')
const prompt = ref('')
const isReceiving = ref(false)
const appendIconInputPrompt = ref('mdi-focus-auto')
const messageStore = useMessageStore()
const { messages } = storeToRefs(messageStore)
const { addMessage } = messageStore

const bigModel = useBigModel()
const { message: response } = storeToRefs(bigModel)
const { getResponse } = bigModel

const keepInputFocus = ref(true)

// Keep input Focused
const chatMsgWatcher = watch(messages.value, () => {
    nextTick(() => {
        inputPrompt.value.focus()
    })
})

function setMsgWatcher() {
    keepInputFocus.value = !keepInputFocus.value
    appendIconInputPrompt.value = keepInputFocus.value ? 'mdi-focus-auto' : ' mdi-cellphone-text'
    if (keepInputFocus.value) {
        chatMsgWatcher.resume()
    } else {
        chatMsgWatcher.pause()
    }
}

async function sendPrompt() {
    isReceiving.value = true
    addMessage({ role: 'user', content: prompt.value })
    prompt.value = ''
    const message = { role: 'assistant', content: '' }
    await getResponse(messages.value)
    message.content = response.value
    addMessage(message)
    isReceiving.value = false
}
</script>
