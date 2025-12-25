<template>
  <div>
    <v-btn :icon="mdiPlayCircleOutline" :loading="isLoading" @click="play" />
    <audio v-if="recordStore.record.dialogue" autoplay controls class="w-100 my-2">
      <source :src="recordStore.record.dialogue" type="audio/mpeg" />
    </audio>
  </div>
</template>

<script setup>
import { mdiPlayCircleOutline } from '@mdi/js'
const recordStore = useRecordStore()
const isLoading = ref(false)
const { content } = defineProps({
  content: { type: String, required: true },
})

// 截图
async function play() {
  isLoading.value = true
  await recordStore.getAudio(content)
  isLoading.value = false
}
</script>
