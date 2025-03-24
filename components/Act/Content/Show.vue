<template>
  <v-sheet
    class="text-body-1 pa-5 mx-4 my-2 overflow-auto"
    elevation="4"
    rounded="lg"
    height="60vh"
  >
    <v-list class="chatMsgContainer">
      <v-list-item
        v-for="(message, index) in caseStore.actMessages.slice(1)"
        :key="index"
        variant="elevated"
        class="my-3"
        rounded="lg"
        elevation="2"
      >
        <template #title>{{
          message.role === 'user' ? '医生' : caseStore.caseContent['姓名']
        }}</template>
        <template #prepend>
          <v-icon v-if="message.role === 'user'" icon="mdi-doctor" size="x-large" />
          <v-icon v-if="message.role != 'user'" icon="mdi-account-voice" size="x-large" />
        </template>
        <span class="font-weight-bold">{{ message.content }}</span>
      </v-list-item>
    </v-list>
    <div class="chatMsgBottom" />
  </v-sheet>
</template>

<script setup>
const caseStore = useCaseStore()

// 聊天信息更新后自动滚动
// const goTo = useGoTo()
// watch(caseStore.actMessages, () => {
//     nextTick(() => {
//         goTo('.chatMsgBottom', { container: '.chatMsgContainer' })
//     })
// })

// 手机输入法遮挡滚动
// const stateStore = useStateStore()
// watch(
//     () => stateStore.isInputFocused,
//     () => {
//         setTimeout(() => {
//             goTo('.chatMsgBottom', { container: '.chatMsgContainer' })
//         }, 300)
//     }
// )
</script>
