<template>
  <v-card class="overflow-auto" rounded="lg" :height="height" hover>
    <v-card-item class="bg-surface-light">
      <template #prepend>
        <v-icon icon="mdi-alpha-d-circle" />
      </template>
      <v-card-title class="font-weight-bold">对话</v-card-title>
    </v-card-item>
    <v-divider />
    <v-card-text class="text-body-1">
      <div v-if="isConversationModelResponseStringShow" class="conversation">
        <div v-if="modelStore.modelResponse.chat.reasoning_content" class="px-4">
          <details open>
            <summary>🤔 思考过程</summary>
            <MDC :value="modelStore.modelResponse.chat.reasoning_content" />
          </details>
        </div>
        <div>
          <MDC :value="modelStore.modelResponse.chat.content" />
        </div>
      </div>
      <div class="conversation">
        <MDC :value="recordStore.view.conversation" />
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
const stateStore = useStateStore()
const modelStore = useModelStore()
const recordStore = useRecordStore()
const { isConversationModelResponseStringShow } = storeToRefs(stateStore)
const { height } = defineProps({
  height: { type: String, default: '55vh', required: false },
})
</script>
