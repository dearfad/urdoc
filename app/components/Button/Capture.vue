<template>
  <UButton icon="i-lucide-camera" variant="ghost" @click="capture" />
</template>

<script setup>
import { snapdom } from '@zumer/snapdom'
const { captureId } = defineProps({
  captureId: { type: String, required: true },
})
// 截图
async function capture() {
  await snapdom.download(document.getElementById(captureId), {
    format: 'png',
    filename: 'capture',
    backgroundColor: '#fff',
  })
}
</script>
