<template>
    <v-sheet>
        <v-btn
            v-if="isFirst"
            block
            size="x-large"
            class="font-weight-bold"
            text="开始问诊"
            @click="firstChat"
        />
        <v-text-field
            v-if="!isFirst"
            ref="inputPrompt"
            v-model="prompt"
            hide-details
            clearable
            :loading="isReceiving"
            :disabled="isReceiving"
            variant="solo"
            label="请输入"
            :append-inner-icon="appendIconInputPrompt"
            @keyup.enter="sendPrompt"
            @click:append-inner="setMsgWatcher"
            @focus="handleFocus"
            @blur="handleBlur"
        />
    </v-sheet>
</template>

<script setup>
const isFirst = ref(true)
const inputPrompt = useTemplateRef('inputPrompt')
const prompt = ref('')
const isReceiving = ref(false)
const appendIconInputPrompt = ref('mdi-cellphone-text')
const messageStore = useMessageStore()
const { messages } = storeToRefs(messageStore)
const { addMessage } = messageStore

const bigModel = useBigModel()
const { message: response } = storeToRefs(bigModel)
const { getResponse } = bigModel

const keepInputFocus = ref(false)

// Keep input Focused
const chatMsgWatcher = watch(messages.value, () => {
    nextTick(() => {
        inputPrompt.value.focus()
    })
})

onMounted(() => {
    chatMsgWatcher.pause()
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

function firstChat() {
    isFirst.value = false
    prompt.value = '哪里不舒服？'
    sendPrompt()
}

//
const stateStore = useStateStore()
const { isInputFocused } = storeToRefs(stateStore)
function handleFocus() {
    isInputFocused.value = true
}

function handleBlur() {
    isInputFocused.value = false
}
</script>
