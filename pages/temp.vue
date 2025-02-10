<template>
  <div>
    <div>{{ data }}</div>
    <v-btn text="get" @click="getData" />
  </div>
</template>

<script setup>
const data = ref(null)
async function getData() {
  data.value = await $fetch('/api/testapi')
}
</script>
