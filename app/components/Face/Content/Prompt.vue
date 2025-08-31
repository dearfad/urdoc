<template>
  <v-card hover class="text-body-1 px-4 py-2 overflow-auto" rounded="lg">
    {{ promptStore.prompts.image.face }}
  </v-card>
</template>

<script lang="ts" setup>
const promptStore = usePromptStore()
</script>
