<template>
  <v-container class="flex-0-0 pb-0">
    <v-text-field
      ref="inputPrompt"
      v-model="prompt"
      autofocus
      clearable
      :loading="isReceiving"
      :disabled="isReceiving"
      variant="solo"
      label="请输入"
      :append-inner-icon="appendIconInputPrompt"
      @keyup.enter="getResponse"
      @click:append-inner="setMsgWatcher"
    />
  </v-container>
  <v-btn @click="genCase">test</v-btn>
</template>

<script setup>

const isReceiving = ref(false)
const prompt = ref('')
const appendIconInputPrompt = ref('mdi-focus-auto')
const keepInputFocus = ref(true)
const inputPrompt = useTemplateRef('inputPrompt')
const useChatMessages = useState('chatMessages')
const {resMessage, getMessage} = useBigModel()

// Keep input Focused
const chatMsgWatcher = watch(useChatMessages.value, () => {
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

async function getResponse() {
  isReceiving.value = true
  useChatMessages.value.push({ role: 'user', content: prompt.value })
  prompt.value = ''
  const message = { role: 'assistant', content: '' }
  await getMessage(useChatMessages.value)
  message.content = resMessage.value
  useChatMessages.value.push(message)
  isReceiving.value = false
}

const useCasePrompt = useState('casePrompt')
async function genCase(){
  const caseMessages = [{'role':'system','content': useCasePrompt.value},{'role':'user','content':'颈部疾病'}]
  await getMessage(caseMessages)
  console.log(resMessage)
}

</script>
