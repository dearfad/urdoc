<template>
  <!-- <v-sheet
    class="text-body-1 pa-5 mx-4 my-2 overflow-auto"
    elevation="4"
    rounded="lg"
    height="60vh"
  > -->
  <v-sheet>
    <v-img
      width="160"
      min-height="160"
      class="mx-auto"
      :src="recordStore.face"
      rounded="circle"
      @click="showFace"
    >
      <template #placeholder
        ><div v-if="recordStore.face" class="d-flex align-center justify-center fill-height">
          <v-progress-circular color="grey-lighten-4" indeterminate /></div
      ></template>
    </v-img>
  </v-sheet>
</template>

<script setup>
const recordStore = useRecordStore()
function showFace() {
  window.open(caseStore.caseFaceUrl, '_blank')
}
</script>
