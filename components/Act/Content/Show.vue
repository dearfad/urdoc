<template>
  <v-sheet
    class="chatMsgContainer text-body-1 px-4 mx-4 overflow-auto"
    elevation="4"
    rounded="lg"
    height="55vh"
  >
    <div v-if="recordStore.record.act.length > 0">
      <v-list>
        <v-list-item
          v-for="(message, index) in recordStore.record.act.slice(2)"
          :key="index"
          variant="elevated"
          class="my-3"
          rounded="lg"
          elevation="2"
        >
          <template #title>{{
            message.role === 'user' ? '医生' : recordStore.record.case['姓名']
          }}</template>
          <template #prepend>
            <v-icon v-if="message.role === 'user'" icon="mdi-doctor" size="x-large" />
            <v-icon v-if="message.role != 'user'" icon="mdi-account-voice" size="x-large" />
          </template>
          <span class="font-weight-bold">{{ message.content }}</span>
        </v-list-item>
      </v-list>
    </div>
    <div class="chatMsgBottom" />
  </v-sheet>
</template>

<script setup>
const recordStore = useRecordStore()

// 聊天信息更新后自动滚动
const goTo = useGoTo()
watch(recordStore.record.act, () => {
  nextTick(() => {
    goTo('.chatMsgBottom', { container: '.chatMsgContainer' })
  })
})

// 手机输入法遮挡滚动
const stateStore = useStateStore()
watch(
  () => stateStore.isInputFocused,
  () => {
    setTimeout(() => {
      goTo('.chatMsgBottom', { container: '.chatMsgContainer' })
    }, 300)
  }
)
</script>
