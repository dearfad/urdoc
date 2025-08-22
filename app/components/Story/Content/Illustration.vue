<template>
  <v-sheet :height="height">
    <v-img
      v-for="(illustration, index) in recordStore.record.story.插图"
      :key="index"
      :src="illustration"
      class="mx-auto my-4"
      rounded="xl"
      @click="openIllustrationWindow(illustration)"
    >
      <template #placeholder
        ><div v-if="illustration" class="d-flex align-center justify-center fill-height">
          <v-progress-circular color="grey-lighten-4" indeterminate /></div
      ></template>
    </v-img>
  </v-sheet>
</template>

<script setup>
const recordStore = useRecordStore()
const { height } = defineProps({
  height: { type: String, default: '50vh', required: false },
})
function openIllustrationWindow(illustration) {
  window.open(illustration, '_blank')
}
</script>
