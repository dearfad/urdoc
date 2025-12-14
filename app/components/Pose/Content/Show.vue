<template>
  <v-sheet height="55vh" class="mx-auto">
    <video v-if="recordStore.record.pose.url" autoplay loop controls class="responsive-video">
      <source :src="recordStore.record.pose.url" type="video/mp4" />
      您的浏览器不支持 HTML5 视频播放器。
    </video>
  </v-sheet>
</template>

<script setup>
const recordStore = useRecordStore()
</script>

<style scoped>
.video-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.responsive-video {
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  object-fit: contain;
}
</style>
