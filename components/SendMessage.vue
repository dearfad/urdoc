<template>
  <v-container class="flex-0-0 pb-0">
    <v-text-field
      ref="inputPrompt"
      v-model="prompt"
      clearable
      :loading="isReceiving"
      :disabled="isReceiving"
      variant="solo"
      label="请输入"
      :append-inner-icon="appendIconInputPrompt"
      :prepend-inner-icon="isBackendApiReadyIcon"
      @keyup.enter="getResponse"
      @click:append-inner="setMsgWatcher"
      @focus="handleFocus"
      @blur="handleBlur"
    />
  </v-container>
</template>

<script setup>
const isReceiving = ref(false)
const useSimModel = useState('simModel')
const prompt = ref('')
const inputPrompt = useTemplateRef('inputPrompt')
const appendIconInputPrompt = ref('mdi-focus-auto')
const isBackendApiReadyIcon = ref('$warning')
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
  useChatMessages.value.push({ role: 'user', content: prompt.value })
  prompt.value = ''
  const apiKey = import.meta.env.VITE_BIGMODEL_API_KEY
  const message = { role: 'assistant', content: '' }
  const response = await $fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + apiKey,
    },
    body: {
      model: useSimModel.value,
      messages: useChatMessages.value,
    },
  })
  message.content = response.choices[0].message.content
  useChatMessages.value.push(message)
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
