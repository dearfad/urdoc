<template>
  <v-sheet class="d-flex flex-column">
    <ClientOnly>
      <vue-json-pretty v-if="metaenv" :data="metaenv" class="mx-auto" />
    </ClientOnly>
    <v-btn text="GetMetaEnv" class="my-4 mx-auto" @click="getProcessEnv" />
  </v-sheet>
</template>

<script setup>
import VueJsonPretty from 'vue-json-pretty'
import 'vue-json-pretty/lib/styles.css'
const metaenv = ref()
async function getProcessEnv() {
  metaenv.value = import.meta.env
}
</script>
