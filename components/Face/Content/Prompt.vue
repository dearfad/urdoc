<template>
  <v-card hover class="text-body-1 px-4 py-2 overflow-auto mx-4" rounded="lg">
    {{ promptStore.prompts.images.photo }}
  </v-card>
</template>

<script lang="ts" setup>
const promptStore = usePromptStore()
</script>
