<template>
  <v-btn :icon="mdiMonitorScreenshot" @click="capture" />
</template>

<script setup>
import { mdiMonitorScreenshot } from '@mdi/js'
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
