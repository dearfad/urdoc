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
  switch (generateType) {
    case 'case':
      stateStore.isModelResponseShow.case = true
      await recordStore.getCase()
      stateStore.isModelResponseShow.case = false
      break
    case 'story':
      stateStore.isModelResponseShow.story = true
      await recordStore.getStory()
      stateStore.isModelResponseShow.story = false
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
      stateStore.isModelResponseShow.conversation = true
      await recordStore.getConversation()
      stateStore.isModelResponseShow.conversation = false
      break
    case 'discussion':
      stateStore.isModelResponseShow.discussion = true
      await recordStore.getDiscussion()
      stateStore.isModelResponseShow.discussion = false
      break
    case 'comment':
      stateStore.isModelResponseShow.comment = true
      await recordStore.getComment()
      stateStore.isModelResponseShow.comment = false
      break
  }
  isLoading.value = false
}
</script>
