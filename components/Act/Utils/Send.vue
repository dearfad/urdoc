<template>
    <v-sheet>
        <ClientOnly>
            <v-text-field
                ref="inputPrompt"
                v-model="prompt"
                hide-details
                :loading="isReceiving"
                :disabled="isReceiving"
                variant="solo"
                label="请输入"
                :prepend-inner-icon="prependIconInputPrompt"
                append-inner-icon="mdi-send"
                @click:prepend-inner="setMsgWatcher"
                @keyup.enter="sendPrompt"
                @click:append-inner="sendPrompt"
                @focus="handleFocus"
                @blur="handleBlur"
            />
        </ClientOnly>
    </v-sheet>
</template>

<script setup>
const caseStore = useCaseStore()
const promptStore = usePromptStore()
const stateStore = useStateStore()
const modelRouter = useModelRouter()
const prompt = ref('')
const isReceiving = ref(false)

const inputPrompt = useTemplateRef('inputPrompt')
const prependIconInputPrompt = ref('mdi-cellphone-text')
const keepInputFocus = ref(false)

async function sendPrompt() {
    if (prompt.value == '') {
        return
    }
    if (caseStore.actMessages.length == 0) {
        caseStore.actMessages.push({
            role: 'system',
            content:
                promptStore.actPrompt + '下面是用户提供的病历\n' + caseStore.caseContentMarkdown,
        })
    }
    isReceiving.value = true
    caseStore.actMessages.push({ role: 'user', content: prompt.value })
    prompt.value = ''
    const msg = { role: 'assistant', content: '' }
    msg.content = await modelRouter.getAct(caseStore.actMessages)
    caseStore.actMessages.push(msg)
    isReceiving.value = false
}
// 保持输入栏锁定
const chatMsgWatcher = watch(caseStore.actMessages, () => {
    nextTick(() => {
        inputPrompt.value.focus()
    })
})
// 当前输入状态判定
function handleFocus() {
    stateStore.isInputFocused = true
}

function handleBlur() {
    stateStore.isInputFocused = false
}

// 手机输入法遮挡滚动

// const goTo = useGoTo()

// watch(
//     () => stateStore.isInputFocused,
//     () => {
//         setTimeout(() => {
//             goTo('.generateCaseBottom', { container: '.generateCaseContainer' })
//         }, 300)
//     }
// )

// 手机输入法遮挡滚动
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
</script>
