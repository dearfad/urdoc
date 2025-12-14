<template>
  <v-sheet class="text-body-1 pa-5 mx-4 overflow-auto" elevation="4" rounded="lg" height="55vh">
    <v-textarea
      v-model="recordStore.record.story['content']"
      class="mt-0"
      rows="1"
      auto-grow
      label="故事"
      variant="outlined"
      hide-details="auto"
    />
  </v-sheet>
</template>

<script setup>
const recordStore = useRecordStore()
</script>
