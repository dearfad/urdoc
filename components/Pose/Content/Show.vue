<template>
  <v-sheet
    class="text-body-1 pa-5 mx-4 my-2 overflow-auto"
    elevation="4"
    rounded="lg"
    height="60vh"
  >
    <video v-if="caseStore.casePose" width="400" autoplay loop controls>
      <source :src="caseStore.casePose" type="video/mp4" />
      您的浏览器不支持 HTML5 视频播放器。
    </video>
  </v-sheet>
</template>

<script lang="ts" setup>
const caseStore = useCaseStore()
</script>
