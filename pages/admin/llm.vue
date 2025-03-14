<template>
  <v-sheet class="d-flex flex-column">
    <ClientOnly>
      {{ data }}
    </ClientOnly>
    <v-btn text="Test LLM" class="my-4 mx-auto" @click="getRes" />
  </v-sheet>
</template>

<script setup>
const data = ref()
async function getRes() {
  data.value = await $fetch('/api/case/create')
}
</script>
