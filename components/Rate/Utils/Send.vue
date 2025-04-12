<template>
  <v-sheet class="d-flex flex-column mx-4">
    <!-- <v-text-field
      ref="inputPrompt"
      v-model="prompt"
      class="font-weight-bold my-5"
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
    /> -->
    <v-text-field
      v-if="caseStore.rateMessages.length != 0"
      v-model="prompt"
      class="font-weight-bold my-5 elevation-4 rounded-lg"
      hide-details
      :loading="isLoading"
      :disabled="isLoading"
      variant="solo"
      label="请输入"
      prepend-inner-icon="mdi-cellphone-text"
      append-inner-icon="mdi-send"
      @keyup.enter="sendPrompt"
      @click:append-inner="sendPrompt"
    />
    <v-btn
      v-if="caseStore.rateMessages.length === 0"
      size="x-large"
      class="font-weight-bold my-5"
      elevation="4"
      rounded="lg"
      text="开始对话"
      @click=";(prompt = '请提问'), sendPrompt()"
    />
    <v-btn
      size="x-large"
      class="font-weight-bold my-5"
      elevation="4"
      rounded="lg"
      text="清空对话"
      @click="caseStore.rateMessages = []"
    />
    <CommonModelSelector model-type="chat" model-usage="rate" />
    <CommonPromptSelector />
    <CommonApiBaseUrlSelector />
  </v-sheet>
</template>

<script setup>
const caseStore = useCaseStore()
const promptStore = usePromptStore()
// const stateStore = useStateStore()
const modelRouter = useModelRouter()
const prompt = ref('')
const isLoading = ref(false)

// const inputPrompt = useTemplateRef('inputPrompt')
// const prependIconInputPrompt = ref('mdi-cellphone-text')
// const keepInputFocus = ref(false)

async function sendPrompt() {
  if (prompt.value == '') {
    return
  }
  if (caseStore.rateMessages.length == 0) {
    caseStore.rateMessages.push({
      role: 'system',
      content: promptStore.ratePrompt + '下面是用户提供的题库：\n' + caseStore.caseTestMarkdown,
    })
  }
  isLoading.value = true
  caseStore.rateMessages.push({ role: 'user', content: prompt.value })
  prompt.value = ''
  const msg = { role: 'assistant', content: '' }
  msg.content = await modelRouter.getRate(caseStore.rateMessages)
  caseStore.rateMessages.push(msg)
  isLoading.value = false
}

// 保持输入栏锁定
// const chatMsgWatcher = watch(caseStore.rateMessages, () => {
//   nextTick(() => {
//     inputPrompt.value.focus()
//   })
// })
// 当前输入状态判定
// function handleFocus() {
//   stateStore.isInputFocused = true
// }

// function handleBlur() {
//   stateStore.isInputFocused = false
// }

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
// onMounted(() => {
//   chatMsgWatcher.pause()
// })
// function setMsgWatcher() {
//   keepInputFocus.value = !keepInputFocus.value
//   prependIconInputPrompt.value = keepInputFocus.value ? 'mdi-focus-auto' : ' mdi-cellphone-text'
//   if (keepInputFocus.value) {
//     chatMsgWatcher.resume()
//   } else {
//     chatMsgWatcher.pause()
//   }
// }
</script>
