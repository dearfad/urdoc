<template>
  <v-sheet height="55vh" class="mx-auto">
    <audio v-if="recordStore.record.voice" autoplay controls>
      <source :src="recordStore.record.voice" type="audio/mpeg" />
    </audio>
  </v-sheet>
</template>

<script setup>
const recordStore = useRecordStore()
</script>
