<template>
  <v-card class="overflow-auto" rounded="lg" hover>
    <ClientOnly>
      <v-card-item class="bg-surface-light">
        <template #prepend>
          <v-icon icon="mdi-alpha-s-circle" />
        </template>
        <template #append>
          <v-icon
            :icon="isReasoningContentShow ? 'mdi-head-cog-outline' : 'mdi-head-minus-outline'"
            @click="isReasoningContentShowSwitches = !isReasoningContentShowSwitches"
          />
        </template>
        <v-card-title class="font-weight-bold">故事</v-card-title>
      </v-card-item>
      <v-divider />
      <v-card-text>
        <div v-if="isReasoningContentShow" class="reasoning my-4">
          <details open>
            <summary class="font-weight-bold">思考过程</summary>
            <v-divider class="my-2" />
            <MDC :value="reasoning" />
            <v-divider class="my-2" />
          </details>
        </div>
        <div v-if="stateStore.isModelResponseShow.story" class="story">
          <MDC :value="modelStore.modelResponse.chat.content" />
        </div>
        <div v-else class="story">
          <MDC :value="recordStore.view.story.markdown" />
        </div>
      </v-card-text>
    </ClientOnly>
  </v-card>
</template>

<script setup>
const stateStore = useStateStore()
const modelStore = useModelStore()
const recordStore = useRecordStore()

// 是否显示思考过程
const isReasoningContentShowSwitches = ref(true)
const isReasoningContentShow = computed(
  () =>
    (stateStore.isModelResponseShow.story && modelStore.modelResponse.chat.reasoning_content) ||
    (isReasoningContentShowSwitches.value && recordStore.record.reasoning.story)
)

// 思考内容
const reasoning = computed(
  () => recordStore.record.reasoning.story || modelStore.modelResponse.chat.reasoning_content
)
</script>
