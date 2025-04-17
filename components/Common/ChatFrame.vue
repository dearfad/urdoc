<template>
  <v-sheet>
    <!-- <v-text-field
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
    /> -->
    <v-text-field
      v-if="recordStore.record[chatType  as 'act' | 'rate'].length > 0"
      v-model="stateStore.userPrompt"
      class="font-weight-bold my-5 elevation-4 rounded-lg"
      hide-details
      :loading="isLoading"
      :disabled="isLoading"
      variant="solo"
      label="请输入"
      prepend-inner-icon="mdi-cellphone-text"
      append-inner-icon="mdi-send"
      @keyup.enter="sendUserPrompt"
      @click:append-inner="sendUserPrompt"
    />
    <v-btn
      v-if="recordStore.record[chatType as 'act' | 'rate'].length === 0"
      size="x-large"
      class="font-weight-bold my-5"
      block
      elevation="4"
      rounded="lg"
      text="开始对话"
      @click=";(stateStore.userPrompt = '哪里不舒服？'), sendUserPrompt()"
    />
    <v-btn
      size="x-large"
      class="font-weight-bold my-5"
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
// const { chatType } = defineProps<{
//   chatType: 'act' | 'rate'
// }>()

const isLoading = ref(false)

// const inputPrompt = useTemplateRef('inputPrompt')
// const prependIconInputPrompt = ref('mdi-cellphone-text')
// const keepInputFocus = ref(false)

async function sendUserPrompt() {
  if (stateStore.userPrompt == '') {
    return
  }
  isLoading.value = true
  await recordStore.getAct()
  stateStore.userPrompt = ''
  isLoading.value = false
}

// 保持输入栏锁定
// const chatMsgWatcher = watch(caseStore.actMessages, () => {
//   nextTick(() => {
//     inputPrompt.value.focus()
//   })
// })
// 当前输入状态判定
// function handleFocus() {
//   stateStore.isInputFocused = true
//   stateStore.isBottomNavigationShow = false
// }

// function handleBlur() {
//   stateStore.isInputFocused = false
//   stateStore.isBottomNavigationShow = true
// }

// 手机输入法遮挡滚动

// const goTo = useGoTo()

// watch(
//   () => stateStore.isInputFocused,
//   () => {
//     setTimeout(() => {
//       goTo('.generateCaseBottom', { container: '.generateCaseContainer' })
//       goTo('.showSheet')
//     }, 300)
//   }
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
