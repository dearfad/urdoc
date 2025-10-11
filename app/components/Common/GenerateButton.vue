<template>
  <v-btn
    hover
    size="x-large"
    class="font-weight-bold"
    rounded="lg"
    text="开始生成"
    :loading="isLoading"
    block
    @click="generate"
  >
    <template #loader>
      <v-progress-circular indeterminate color="white" class="mr-4" />
      {{ stateStore.modelResponseField }}
    </template>
  </v-btn>
</template>

<script lang="ts" setup>
const { generateType } = defineProps({
  generateType: { type: String, required: true },
})
const stateStore = useStateStore()
const recordStore = useRecordStore()
const isLoading = ref(false)

async function generate() {
  isLoading.value = true
  stateStore.recordShowContent = 'markdown'
  stateStore.isModelResponseStringShow = true
  switch (generateType) {
    case 'case':
      stateStore.isCaseModelResponseStringShow = true
      await recordStore.getCase()
      stateStore.isCaseModelResponseStringShow = false
      break
    case 'story':
      stateStore.isStoryModelResponseStringShow = true
      await recordStore.getStory()
      stateStore.isStoryModelResponseStringShow = false
      break
    case 'test':
      await recordStore.getTest()
      break
    case 'face':
      await recordStore.getFace()
      break
    case 'pose':
      await recordStore.getPose()
      break
    case 'conversation':
      await recordStore.getConversation()
      break
    case 'discussion':
      await recordStore.getDiscussion()
      break
  }
  stateStore.isModelResponseStringShow = false
  isLoading.value = false
}
</script>
