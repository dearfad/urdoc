<template>
  <UButton
    :icon="icon"
    :color="color"
    variant="ghost"
    :class="iconClass"
    :disabled="status === 'loading'"
    @click="handleClick"
  />
</template>

<script setup>
const props = defineProps({
  text: { type: String, default: '' },
})

const audioStore = useAudioStore()
const toast = useToast()

const status = ref('idle')
const audioRef = ref(null)

const icon = computed(() => {
  if (status.value === 'loading') return 'i-lucide-loader-2'
  if (status.value === 'playing') return 'i-lucide-square'
  return 'i-lucide-file-volume'
})

const iconClass = computed(() => ({
  'animate-spin': status.value === 'loading',
}))

const color = computed(() => {
  if (status.value === 'playing') return 'success'
  return 'neutral'
})

async function handleClick() {
  if (status.value === 'playing') {
    stopPlayback()
    return
  }
  if (status.value === 'loading') return
  await synthesize()
}

async function synthesize() {
  if (!props.text) {
    toast.add({ title: '没有可朗读的内容', color: 'warning', icon: 'i-lucide-alert-triangle', duration: 3000 })
    return
  }
  status.value = 'loading'
  try {
    const { url } = await audioStore.synthesize(props.text)
    playAudio(url)
  } catch (e) {
    status.value = 'idle'
    toast.add({ title: '语音合成失败', description: e.message, color: 'error', icon: 'i-lucide-alert-circle' })
  }
}

function playAudio(url) {
  const audio = new Audio(url)
  audioRef.value = audio
  audio.onended = () => { status.value = 'idle'; audioRef.value = null }
  audio.onerror = () => { status.value = 'idle'; audioRef.value = null }
  audio.play().catch(() => {
    status.value = 'idle'
    audioRef.value = null
  })
  status.value = 'playing'
}

function stopPlayback() {
  if (audioRef.value) {
    audioRef.value.pause()
    audioRef.value = null
  }
  status.value = 'idle'
}
</script>
