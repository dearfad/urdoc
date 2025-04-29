<template>
  <v-sheet class="d-flex flex-column ga-4">
    <v-text-field
      v-if="recordStore.record[chatType  as 'act' | 'rate'].length > 0"
      ref="inputPrompt'"
      v-model="stateStore.userPrompt"
      class="font-weight-bold my-5 elevation-4 rounded-lg"
      hide-details
      :loading="isLoading"
      :disabled="isLoading"
      variant="solo"
      label="请输入"
      :prepend-inner-icon="prependInnerIcon"
      append-inner-icon="mdi-send"
      @click:prepend-inner="setMsgWatcher"
      @keyup.enter="sendUserPrompt"
      @click:append-inner="sendUserPrompt"
      @focus="handleFocus"
      @blur="handleBlur"
    />
    <v-btn
      v-if="recordStore.record[chatType as 'act' | 'rate'].length === 0"
      size="x-large"
      class="font-weight-bold"
      block
      elevation="4"
      rounded="lg"
      text="开始对话"
      @click="
        ;(stateStore.userPrompt = chatType === 'act' ? '哪里不舒服？' : '请提问'), sendUserPrompt()
      "
    />
    <v-btn
      size="x-large"
      class="font-weight-bold"
      elevation="4"
      block
      rounded="lg"
      text="清空对话"
      @click="recordStore.record[chatType as 'act' | 'rate'] = []"
    />
  </v-sheet>
</template>

<script lang="ts" setup>
const stateStore = useStateStore()
const recordStore = useRecordStore()
const { chatType } = defineProps({
  chatType: { type: String, required: true },
})

const isLoading = ref(false)
const prependInnerIcon = ref('mdi-cellphone-text')

const inputPrompt = useTemplateRef('inputPrompt')
const isKeepInputFocus = ref(false)

// 保持输入栏锁定
const chatMsgWatcher = watch(
  () => recordStore.record[chatType],
  () => {
    nextTick(() => {
      if (inputPrompt.value) {
        inputPrompt.value.focus()
      }
    })
  }
)
// 当前输入状态判定
function handleFocus() {
  stateStore.isInputFocused = true
  stateStore.isBottomNavigationShow = false
}

function handleBlur() {
  stateStore.isInputFocused = false
  stateStore.isBottomNavigationShow = true
}

function setMsgWatcher() {
  isKeepInputFocus.value = !isKeepInputFocus.value
  prependInnerIcon.value = isKeepInputFocus.value ? 'mdi-focus-auto' : ' mdi-cellphone-text'
  if (isKeepInputFocus.value) {
    chatMsgWatcher.resume()
  } else {
    chatMsgWatcher.pause()
  }
}

async function sendUserPrompt() {
  if (!stateStore.userPrompt) {
    return
  }
  chatMsgWatcher.pause()
  isLoading.value = true
  if (chatType === 'act') {
    await recordStore.getAct()
  } else {
    await recordStore.getRate()
  }
  stateStore.userPrompt = ''
  isLoading.value = false
  if (isKeepInputFocus.value) {
    chatMsgWatcher.resume()
  }
}
</script>
