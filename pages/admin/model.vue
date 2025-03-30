<template>
  <v-sheet class="d-flex flex-column mx-4">
    <CommonModelSelector />
    {{ stateStore.selectedModel }}
  </v-sheet>
</template>
<script lang="ts" setup>
const stateStore = useStateStore()
</script>
