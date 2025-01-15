<template>
    <v-sheet>
        <ClientOnly>
            <v-btn
                v-if="!stateStore.isActing"
                block
                size="x-large"
                class="font-weight-bold"
                text="开始问诊"
                @click="firstChat"
            />
            <!-- <v-text-field
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
            /> -->
            <v-text-field
                v-if="stateStore.isActing"
                ref="inputPrompt"
                v-model="prompt"
                hide-details
                :loading="isReceiving"
                :disabled="isReceiving"
                variant="solo"
                label="请输入"
                append-inner-icon="mdi-send"
                @keyup.enter="sendPrompt"
                @click:append-inner="sendPrompt"
            />
        </ClientOnly>
    </v-sheet>
</template>

<script setup>
const stateStore = useStateStore()
// const inputPrompt = useTemplateRef('inputPrompt')
const prompt = ref('')
const isReceiving = ref(false)
// const prependIconInputPrompt = ref('mdi-cellphone-text')

const promptStore = usePromptStore()
const caseStore = useCaseStore()
const modelRouter = useModelRouter()
// const keepInputFocus = ref(false)

// Keep input Focused
// const chatMsgWatcher = watch(messages.value, () => {
//     nextTick(() => {
//         inputPrompt.value.focus()
//     })
// })

// onMounted(() => {
//     chatMsgWatcher.pause()
// })

// function setMsgWatcher() {
//     keepInputFocus.value = !keepInputFocus.value
//     prependIconInputPrompt.value = keepInputFocus.value ? 'mdi-focus-auto' : ' mdi-cellphone-text'
//     if (keepInputFocus.value) {
//         chatMsgWatcher.resume()
//     } else {
//         chatMsgWatcher.pause()
//     }
// }

async function sendPrompt() {
    if (prompt.value == '') {
        return
    }
    isReceiving.value = true
    caseStore.actMessages.push({ role: 'user', content: prompt.value })
    prompt.value = ''
    const msg = { role: 'assistant', content: '' }
    // await getResponse(messages.value)
    msg.content = await modelRouter.getAct(caseStore.actMessages)
    // console.log(msg.content)
    caseStore.actMessages.push(msg)
    isReceiving.value = false
}

function firstChat() {
    stateStore.isActing = true
    caseStore.actMessages = []
    caseStore.actMessages.push({
        role: 'system',
        content: promptStore.actPrompt + '下面是用户提供的病历\n' + caseStore.caseContentMarkdown,
    })
    prompt.value = '哪里不舒服？'
    sendPrompt()
}

//
// const stateStore = useStateStore()
// const { isInputFocused } = storeToRefs(stateStore)
// function handleFocus() {
//     isInputFocused.value = true
// }

// function handleBlur() {
//     isInputFocused.value = false
// }

// 手机输入法遮挡滚动

// const { isInputFocused } = storeToRefs(stateStore)
// const goTo = useGoTo()

// watch(
//     () => stateStore.isInputFocused,
//     () => {
//         setTimeout(() => {
//             goTo('.generateCaseBottom', { container: '.generateCaseContainer' })
//         }, 300)
//     }
// )

// function handleFocus() {
//     isInputFocused.value = true
// }

// function handleBlur() {
//     isInputFocused.value = false
// }
</script>
