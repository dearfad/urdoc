<template>
  <v-sheet class="d-flex flex-column ga-4 mx-4">
    <v-text-field
      v-model="text"
      label="文本"
      variant="outlined"
      hide-details="auto"
      clearable
      density="comfortable"
      maxlength="40"
      counter
    />
    <v-btn
      size="x-large"
      class="font-weight-bold"
      elevation="4"
      rounded="lg"
      text="开始生成"
      :loading="isLoading"
      @click="generateVoice"
    />
    <CommonVoiceCard />
  </v-sheet>
</template>

<script setup>
const isLoading = ref(false)
const text = ref('')
const recordStore = useRecordStore()
const stateStore = useStateStore()
async function generateVoice() {
  isLoading.value = true
  recordStore.record.voice = ''
  if (stateStore.isVoice) {
    await recordStore.getVoice(text.value)
  }
  isLoading.value = false
}
</script>
