<template>
  <v-container class="flex-fill bg-blue-lighten-4 overflow-auto">
    <v-list class="chatMsgContainer h-100 font-weight-bold">
      <v-list-item
        v-for="(message, index) in useChatMessages.slice(1)"
        :key="index"
        :title="message.role + ':'"
      >
        {{ message.content }}
      </v-list-item>
      <v-list-item class="chatMsgBottom" />
    </v-list>
  </v-container>
</template>

<script setup>
import { watch, nextTick } from 'vue'
import { useGoTo } from 'vuetify'

const useChatMessages = useState('chatMessages')
const goTo = useGoTo()
watch(useChatMessages.value, () => {
  nextTick(() => {
    goTo('.chatMsgBottom', { container: '.chatMsgContainer' })
  })
})
</script>
