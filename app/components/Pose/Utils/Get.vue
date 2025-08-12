<template>
  <v-btn
    size="x-large"
    class="font-weight-bold mx-4"
    elevation="4"
    rounded="lg"
    text="获取视频"
    :loading="isLoading"
    @click="getUrl"
  >
    <template #loader>
      <v-progress-circular indeterminate color="white" class="mr-4" />
      {{ stateStore.modelResponseField }}
    </template>
  </v-btn>
</template>

<script setup>
const isLoading = ref(false)
const recordStore = useRecordStore()
const stateStore = useStateStore()
const videoModel = useVideoModel()
async function getUrl() {
  isLoading.value = true
  const url = await videoModel.getUrl(stateStore.poseId)
  if (url) {
    recordStore.record.pose = url
    stateStore.appInfos.push('视频获取成功')
  } else {
    stateStore.appInfos.push('视频生成中...')
  }
  isLoading.value = false
}
</script>
