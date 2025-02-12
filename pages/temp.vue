<template>
  <div>
    <div>{{ res }}</div>
    <v-btn text="get" @click="getData" />
  </div>
</template>

<script setup>
const res = ref(null)
async function getData() {
  const data = await $fetch('/api/ai-test')
  res.value = data.response
}
</script>
