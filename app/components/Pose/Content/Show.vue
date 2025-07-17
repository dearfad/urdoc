<template>
  <v-sheet height="55vh" class="mx-auto">
    <video v-if="recordStore.record.pose" autoplay loop controls width="500">
      <source :src="recordStore.record.pose" type="video/mp4" />
      您的浏览器不支持 HTML5 视频播放器。
    </video>
  </v-sheet>
</template>

<script lang="ts" setup>
const recordStore = useRecordStore()
</script>
