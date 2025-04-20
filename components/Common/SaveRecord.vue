<template>
  <v-sheet> <v-btn text="save" @click="run" /></v-sheet>
</template>

<script setup>
async function run() {
  const result = $fetch('/api/save')
  console.log(result)
}
</script>
