<template>
  <v-sheet class="d-flex flex-column">
    <ClientOnly>
      <vue-json-pretty v-if="env" :data="env" class="mx-auto" />
    </ClientOnly>
    <v-btn text="GetEnv" class="my-4 mx-auto" @click="getProcessEnv" />
  </v-sheet>
</template>

<script setup>
import VueJsonPretty from 'vue-json-pretty'
import 'vue-json-pretty/lib/styles.css'
const env = ref()
async function getProcessEnv() {
  env.value = await $fetch('/function/admin/context')
}
</script>
