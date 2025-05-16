<template>
  <v-sheet class="d-flex flex-column ga-4 mx-4">
    <v-text-field
      v-model="text"
      class="my-4"
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
  </v-sheet>
</template>

<script setup>
const isLoading = ref(false)
const text = ref('')
const recordStore = useRecordStore()
const id = ref(1)
async function generateVoice() {
  isLoading.value = true
  recordStore.record.voice = ''
  id.value = Math.floor(Math.random() * 14) + 1
  const response = await $fetch(
    `https://textreadtts.com/tts/convert?accessKey=FREE&language=chinese&speaker=speaker${id.value}&text=${text.value}`
  )
  recordStore.record.voice = response.audio
  isLoading.value = false
}
</script>
