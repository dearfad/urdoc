<template>
  <v-card class="overflow-auto" hover rounded="lg" :height="height">
    <v-card-item class="bg-surface-light">
      <template #prepend>
        <v-icon icon="mdi-alpha-s-circle" />
      </template>
      <v-card-title class="font-weight-bold">故事</v-card-title>
    </v-card-item>
    <v-divider />
    <v-card-text class="text-body-1">
      <div v-if="isStoryModelResponseStringShow" class="story">
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
      <div class="story">
        <MDC :value="recordStore.view.story.markdown" />
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
const stateStore = useStateStore()
const modelStore = useModelStore()
const recordStore = useRecordStore()
const { isStoryModelResponseStringShow } = storeToRefs(stateStore)
const { height } = defineProps({
  height: { type: String, default: '55vh', required: false },
})
</script>
