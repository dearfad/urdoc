<template>
  <v-sheet :height="height">
    <v-img :src="recordStore.record.face" class="mx-auto" rounded="xl" @click="openFaceWindow">
      <template #placeholder>
        <div v-if="recordStore.record.face" class="d-flex align-center justify-center fill-height">
          <v-progress-circular color="grey-lighten-4" indeterminate />
        </div>
      </template>
    </v-img>
  </v-sheet>
</template>

<script setup>
const recordStore = useRecordStore()
const { height } = defineProps({
  height: { type: String, default: '50vh', required: false },
})
function openFaceWindow() {
  // 点击下载，待处理点击开新窗口显示图片
  // window.open(recordStore.record.face, '_blank')
}
</script>
