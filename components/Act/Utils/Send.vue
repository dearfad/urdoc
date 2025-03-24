<template>
  <v-sheet class="d-flex flex-column mx-4">
    <v-text-field
      v-if="caseStore.actMessages.length != 0"
      ref="inputPrompt"
      v-model="prompt"
      class="font-weight-bold my-5 elevation-4 rounded-lg"
      hide-details
      :loading="isLoading"
      :disabled="isLoading"
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
    <v-btn
      v-if="caseStore.actMessages.length === 0"
      size="x-large"
      class="font-weight-bold my-5"
      elevation="4"
      rounded="lg"
      text="开始对话"
      @click=";(prompt = '哪里不舒服？'), sendPrompt()"
    />
    <v-btn
      size="x-large"
      class="font-weight-bold my-5"
      elevation="4"
      rounded="lg"
      text="清空对话"
      @click="caseStore.actMessages = []"
    />
    <CommonModelSelector />
    <CommonPromptSelector />
  </v-sheet>
</template>

<script setup>
const stateStore = useStateStore()
const caseStore = useCaseStore()
const promptStore = usePromptStore()
const modelRouter = useModelRouter()
const prompt = ref('')
const isLoading = ref(false)

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
      content: promptStore.actPrompt + '下面是用户提供的病历\n' + caseStore.caseContentMarkdown,
    })
  }
  isLoading.value = true
  caseStore.actMessages.push({ role: 'user', content: prompt.value })
  prompt.value = ''
  const msg = { role: 'assistant', content: '' }
  msg.content = await modelRouter.getAct(caseStore.actMessages)
  caseStore.actMessages.push(msg)
  isLoading.value = false
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
