<template>
  <v-sheet class="my-2 border-thin border-dotted text-body-2 pa-2">
    {{ promptStore.prompts.image.face }}
  </v-sheet>
</template>

<script lang="ts" setup>
const promptStore = usePromptStore()
</script>
