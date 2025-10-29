<template>
  <v-btn
    block
    text="开始生成"
    :loading="isLoading"
    size="x-large"
    class="font-weight-black"
    @click="generate"
  >
    <template #loader>
      <v-progress-circular indeterminate color="white" class="mr-4" />
      {{ field }}
    </template>
  </v-btn>
</template>

<script setup>
const recordStore = useRecordStore()
const isLoading = ref(false)
const field = ref('')
async function generate() {
  //
  isLoading.value = true
  // 病例
  field.value = '生成病例...'
  await recordStore.getCase()
  // 故事
  field.value = '生成故事...'
  await recordStore.getStory()
  // 对话
  // field.value = '生成对话&头像...'
  // await Promise.all([recordStore.getConversation(), recordStore.getFace()])
  field.value = '生成对话...'
  await recordStore.getConversation()
  // 讨论
  // field.value = '生成讨论$插图...'
  // await Promise.all([recordStore.getDiscussion(), recordStore.getStoryIllustration()])
  field.value = '生成讨论...'
  await recordStore.getDiscussion()

  field.value = '生成头像...'
  await recordStore.getFace()
  // field.value = '生成插图...'
  // await recordStore.getStoryIllustration()
  //
  isLoading.value = false
}
</script>
