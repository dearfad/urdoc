<template>
  <div>
    <v-btn :icon="btnIcon" :loading="isLoading" @click="play" />
    <audio ref="audioPlayer" :src="audioUrl" @play="onPlay" @pause="onPause" @ended="onEnded" />
  </div>
</template>

<script setup>
import { mdiPlayCircleOutline, mdiVolumeHigh, mdiPause } from '@mdi/js'
const { content } = defineProps({
  content: { type: String, required: true },
})
const recordStore = useRecordStore()

const audioPlayer = ref(null)
const audioUrl = ref('')
const link = 'https://gitee.com/gitee-ai/moark-assets/raw/master/jay_prompt.wav'
const isLoading = ref(false)
const isPlaying = ref(false)

const btnIcon = computed(() => {
  return audioUrl.value ? (isPlaying.value ? mdiPause : mdiPlayCircleOutline) : mdiVolumeHigh
})
async function getAudio() {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  audioUrl.value = link
}
// 截图
async function play() {
  isLoading.value = true
  if (!audioPlayer.value) return
  if (!audioUrl.value) {
    await getAudio()
    isLoading.value = false
    return
  }
  if (audioPlayer.value.paused) {
    audioPlayer.value.play()
  } else {
    audioPlayer.value.pause()
  }
  isLoading.value = false
}

function onPlay() {
  isPlaying.value = true
}
function onPause() {
  isPlaying.value = false
}
function onEnded() {
  isPlaying.value = false
}
</script>
