<template>
  <v-sheet class="d-flex flex-column w-100 w-md-75 mx-auto mb-16">
    <v-sheet
      class="text-body-1 pa-5 mx-4 my-2 overflow-auto"
      elevation="4"
      rounded="lg"
      height="60vh"
    >
      <vue-json-pretty v-if="content" :data="content" />
    </v-sheet>
    <v-btn
      text="Context"
      size="x-large"
      class="font-weight-bold my-5"
      elevation="4"
      rounded="lg"
      @click="getContext"
    />
    <v-btn
      text="Function"
      size="x-large"
      class="font-weight-bold my-5"
      elevation="4"
      rounded="lg"
      @click="postFunction"
    />
  </v-sheet>
</template>

<script setup>
import VueJsonPretty from 'vue-json-pretty'
import 'vue-json-pretty/lib/styles.css'
const content = ref()
async function getContext() {
  content.value = await $fetch('/function/admin/context')
}
async function postFunction() {
  content.value = await $fetch('/function/cstar/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: {
      test: { name: 'test' },
    },
  })
}
</script>
