<template>
  <v-sheet class="d-flex flex-column w-100 w-md-75 mx-auto mb-16">
    <v-sheet
      class="text-body-1 pa-5 mx-4 my-2 overflow-auto"
      elevation="4"
      rounded="lg"
      height="60vh"
    >
      <vue-json-pretty v-if="context" :data="context" />
    </v-sheet>
    <v-sheet class="mx-4">
      <v-btn
        block
        text="Context"
        size="x-large"
        class="font-weight-bold my-5"
        elevation="4"
        rounded="lg"
        @click="getContext"
      />
    </v-sheet>
  </v-sheet>
</template>

<script setup>
import VueJsonPretty from 'vue-json-pretty'
import 'vue-json-pretty/lib/styles.css'

const context = ref()
async function getContext() {
  context.value = await $fetch('/function/admin/context')
}
</script>
