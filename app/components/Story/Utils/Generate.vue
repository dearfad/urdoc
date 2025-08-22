<template>
  <div class="d-flex flex-column ga-4">
    <CommonGenerateButton generate-type="story" />
    <CommonTagInput tag-type="story" />
    <CommonModelCard model-type="chat" model-usage="story" />
    <CommonPromptCard usage="story" />
    <v-btn
      hover
      size="x-large"
      class="font-weight-bold"
      rounded="lg"
      text="生成插图"
      :loading="isLoading"
      block
      @click="generateIllustration"
    />
    <CommonPromptCard usage="illustration" />
  </div>
</template>

<script setup>
const recordStore = useRecordStore()
const isLoading = ref(false)

async function generateIllustration() {
  isLoading.value = true
  await recordStore.getStoryIllustration()
  isLoading.value = false
}
</script>
