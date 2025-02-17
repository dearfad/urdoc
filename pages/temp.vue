<template>
  <div>
    <div>{{ data }}</div>
    <v-btn text="get" :loading="isLoading" @click="getData" />
  </div>
</template>

<script setup>
const data = ref(null)
const isLoading = ref(false)
async function getData() {
  isLoading.value = true
  data.value = await $fetch('/api/supabase')
  isLoading.value = false
}
</script>
