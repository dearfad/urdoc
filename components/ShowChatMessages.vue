<template>
  <v-container class="flex-fill bg-blue-lighten-4 overflow-auto">
    <v-btn v-if="!isChatting" class="h-100 w-100 text-h3" @click="startChatting">开始</v-btn>
    <v-list v-if="isChatting" class="chatMsgContainer h-100 font-weight-bold">
      <v-list-item v-for="(message, index) in useChatMessages.slice(1)" :key="index" :title="message.role + ':'">
        {{ message.content }}
      </v-list-item>
      <v-list-item class="chatMsgBottom" />
    </v-list>
  </v-container>
</template>

<script setup>
import { ref, watch, nextTick } from "vue";
import { useGoTo } from "vuetify";

const useChatMessages = useState("chatMessages");
const isChatting = ref(false);
const goTo = useGoTo();

watch(useChatMessages, () => {
  nextTick(() => {
    goTo(".chatMsgBottom", { container: ".chatMsgContainer" });
  });
});

function startChatting() {
  isChatting.value = true;
}
</script>
