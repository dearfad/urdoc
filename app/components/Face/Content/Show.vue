<template>
  <v-img :src="imgUrl" class="mx-auto" rounded="xl" @click="openFaceWindow" />
</template>

<script setup>
const recordStore = useRecordStore()
const imgUrl = computed(() => {
  if (recordStore.record.face) return recordStore.record.face
  return recordStore.record.case.性别 === '男' ? '/placeholder_male.png' : '/placeholder_female.png'
})

function openFaceWindow() {
  // 点击下载，待处理点击开新窗口显示图片
  // window.open(recordStore.record.face, '_blank')
}
</script>
