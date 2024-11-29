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
            :loading="isReceiving"
            :disabled="isReceiving"
            variant="solo"
            label="请输入"
            :prepend-inner-icon="prependIconInputPrompt"
            append-inner-icon="mdi-send"
            @keyup.enter="sendPrompt"
            @click:prepend-inner="setMsgWatcher"
            @click:append-inner="sendPrompt"
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
const prependIconInputPrompt = ref('mdi-cellphone-text')
const messageStore = useMessageStore()
const { messages } = storeToRefs(messageStore)
const { addMessage } = messageStore

const bigModel = useBigModel()
const { message } = storeToRefs(bigModel)
const { getResponse } = bigModel

const promptStore = usePromptStore()
const { askPrompt } = storeToRefs(promptStore)

const testStore = useTestStore()
const { test } = storeToRefs(testStore)

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
    prependIconInputPrompt.value = keepInputFocus.value ? 'mdi-focus-auto' : ' mdi-cellphone-text'
    if (keepInputFocus.value) {
        chatMsgWatcher.resume()
    } else {
        chatMsgWatcher.pause()
    }
}

async function sendPrompt() {
    if (prompt.value == '') {
        return
    }
    isReceiving.value = true
    addMessage({ role: 'user', content: prompt.value })
    prompt.value = ''
    const msg = { role: 'assistant', content: '' }
    await getResponse(messages.value)
    msg.content = message.value
    addMessage(msg)
    isReceiving.value = false
}

function firstChat() {
    isFirst.value = false
    addMessage({ role: 'system', content: askPrompt.value + test.value })
    prompt.value = '请提问'
    sendPrompt()
    console.log(messages.value)
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
