<template>
  <div>
    <vue-json-pretty :data="envData" show-line-number="true" />
    <button @click="getEnvData">getEnvData</button>
  </div>
</template>

<script setup>
import VueJsonPretty from 'vue-json-pretty'
import 'vue-json-pretty/lib/styles.css'
const envData = ref()
async function getEnvData() {
  envData.value = await $fetch('/api/env')
}
</script>
