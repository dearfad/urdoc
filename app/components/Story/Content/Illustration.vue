<template>
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
</template>

<script setup>
const recordStore = useRecordStore()

function openIllustrationWindow(illustration) {
  // 点击下载，待定
  // window.open(illustration, '_blank')
}
</script>
