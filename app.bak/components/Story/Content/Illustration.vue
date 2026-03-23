<template>
  <v-sheet>
    <div v-for="(illustration, index) in recordStore.record.story.illustration" :key="index">
      <v-img
        :src="illustration.url"
        class="mx-auto"
        rounded="xl"
        @click="openIllustrationWindow(illustration)"
      >
        <template #placeholder
          ><div v-if="illustration" class="d-flex align-center justify-center fill-height">
            <v-progress-circular color="grey-lighten-4" indeterminate /></div
        ></template>
      </v-img>

      <v-sheet class="my-2 border-thin border-dotted text-body-2 pa-2">
        {{ illustration.title }}
      </v-sheet>
    </div>
  </v-sheet>
</template>

<script setup>
const recordStore = useRecordStore()
function openIllustrationWindow() {
  // 点击下载，待定
  // window.open(illustration, '_blank')
}
</script>
