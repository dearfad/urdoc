<template>
  <v-sheet class="d-flex flex-column">
    <ClientOnly>
      <vue-json-pretty v-if="envData" :data="envData" class="mx-auto" />
    </ClientOnly>
    <v-btn class="mx-auto my-4" text="RuntimeConfig" @click="getRuntimeConfig" />
  </v-sheet>
</template>

<script setup>
import VueJsonPretty from 'vue-json-pretty'
import 'vue-json-pretty/lib/styles.css'
const envData = ref()
async function getRuntimeConfig() {
  envData.value = await $fetch('/api/admin/runtime')
}
</script>
