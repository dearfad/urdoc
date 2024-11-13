<template>
  <v-container class="flex-0-0 pb-0">
    <v-text-field clearable :loading="isReceiving" :disabled="isReceiving" variant="solo" label="请输入" v-model="prompt"
      @keyup.enter="getResponse" ref="inputPrompt" :append-inner-icon="appendIconInputPrompt"
      @click:append-inner="setMsgWatcher" @focus="handleFocus" @blur="handleBlur"
      :prepend-inner-icon="isBackendApiReadyIcon"></v-text-field>
  </v-container>
</template>

<script setup>
// import axios from "axios"
const isReceiving = ref(false)
const useSimModel = useState('simModel')
const prompt = ref("")
const inputPrompt = useTemplateRef("inputPrompt")
const appendIconInputPrompt = ref('mdi-focus-auto')
const isBackendApiReadyIcon = ref("$warning")
const keepInputFocus = ref(true)
const useChatMessages = useState('chatMessages')
const useInputFocused = useState('inputFocused')

onMounted(() => {
  testBackendApi()
})


const chatMsgWatcher = watch(useChatMessages, () => {
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
function handleFocus() {
  useInputFocused.value = true
}
function handleBlur() {
  useInputFocused.value = false
}

async function getResponse() {

  isReceiving.value = true
  useChatMessages.value.push({ "role": "user", "content": prompt.value })
  // prompt.value = ""
  // const apiKey = import.meta.env.VITE_BIGMODEL_API_KEY
  // let message = { role: "assistant", content: "" }
  // let response = await axios({
  //   method: "post",
  //   url: "https://open.bigmodel.cn/api/paas/v4/chat/completions",
  //   headers: {
  //     "Content-Type": "application/json",
  //     Authorization: "Bearer " + apiKey,
  //   },
  //   data: {
  //     model: simModel.value,
  //     messages: chatMessages.value,
  //   },
  // })
  // message.content = response.data.choices[0].message.content
  // addMessage(message)
  isReceiving.value = false
}

async function testBackendApi() {
  // axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
  // const response = await axios.get("")
  // if (response.data.message == 'OK') {
  //   isBackendApiReadyIcon.value = '$success'
  // } else {
  //   isBackendApiReadyIcon.value = '$warning'
  // }
}

</script>
