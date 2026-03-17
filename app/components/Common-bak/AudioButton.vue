<template>
  <div>
    <v-btn :icon="btnIcon" :loading="isLoading" @click="play" />
    <audio
      ref="audioPlayer"
      :src="audioUrl"
      @play="onPlay"
      @pause="onPause"
      @ended="onEnded"
      @error="onError"
      @canplay="onCanplay"
    />
  </div>
</template>

<script setup>
import { mdiPlayCircleOutline, mdiVolumeHigh, mdiPause } from '@mdi/js'

const recordStore = useRecordStore()

const { audioType } = defineProps({
  audioType: { type: String, required: true },
})

const audioPlayer = ref(null)
const isLoading = ref(false)
const isPlaying = ref(false)

const audioUrl = computed(() => recordStore.record.audio[audioType])

const btnIcon = computed(() =>
  audioUrl.value ? (isPlaying.value ? mdiPause : mdiPlayCircleOutline) : mdiVolumeHigh
)

async function getAudio() {
  await recordStore.getAudio(audioType)
}

async function play() {
  isLoading.value = true
  if (!audioUrl.value) {
    await getAudio()
    isLoading.value = false
    return
  }
  audioPlayer.value[audioPlayer.value.paused ? 'play' : 'pause']()
  isLoading.value = false
}

const onPlay = () => (isPlaying.value = true)
const onEnded = () => (isPlaying.value = false)
const onPause = () => (isPlaying.value = false)
const onError = () => (recordStore.record.audio[audioType] = '')
</script>
