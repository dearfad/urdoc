<template>
  <v-card
    class="text-body-1 px-4 py-2 overflow-auto"
    elevation="4"
    rounded="lg"
    :height="height"
    title="讨论区内容"
  >
    <v-divider class="mb-2" />
    <div v-if="stateStore.isStoryModelResponseStringShow">
      <div v-if="modelStore.modelResponse.chat.reasoning_content" class="px-4">
        <details open>
          <summary>🤔 思考过程</summary>
          <MDC :value="modelStore.modelResponse.chat.reasoning_content" />
        </details>
      </div>
      <MDC :value="`${modelStore.modelResponse.chat.content}`" />
    </div>
    <div v-else>
      <p><MDC :value="recordStore.view.discussion" /></p>
    </div>
  </v-card>
</template>

<script setup>
const stateStore = useStateStore()
const modelStore = useModelStore()
const recordStore = useRecordStore()

const { height } = defineProps({
  height: { type: String, default: '55vh', required: false },
})
</script>

<style scoped>
p {
  text-indent: 2em;
}
</style>
