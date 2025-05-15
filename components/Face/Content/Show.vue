<template>
  <v-sheet height="55vh">
    <v-img :src="recordStore.record.face" class="mx-auto" @click="openFaceWindow">
      <template #placeholder
        ><div v-if="recordStore.face" class="d-flex align-center justify-center fill-height">
          <v-progress-circular color="grey-lighten-4" indeterminate /></div
      ></template>
    </v-img>
  </v-sheet>
</template>

<script setup>
const recordStore = useRecordStore()

function openFaceWindow() {
  window.open(recordStore.record.face, '_blank')
}
</script>
