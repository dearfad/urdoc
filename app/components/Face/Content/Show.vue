<template>
  <div>
    <v-img :src="imgUrl" class="mx-auto" rounded="xl" @click="openFaceWindow" />
    <v-img
      src="https://render.edgeoneimg.site/52776082fcf452837b825bd68dab155b/3c2cc1f79c0f47bb8654e1e2c70fae80/ep-23cXnH5UMpMz.jpeg"
      class="mx-auto"
      rounded="xl"
    />
  </div>
</template>

<script setup>
const recordStore = useRecordStore()
const imgUrl = computed(() => {
  if (recordStore.record.face) return recordStore.record.face
  return recordStore.record.case.性别 === '男' ? '/placeholder_male.png' : '/placeholder_female.png'
})

async function openFaceWindow() {
  // 点击下载，待处理点击开新窗口显示图片
  // window.open(recordStore.record.face, '_blank')

  // test 图片渲染
  const response = await fetch('https://render.edgeoneimg.site', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'OE-USER-ID': '3c2cc1f79c0f47bb8654e1e2c70fae80',
      'OE-API-KEY': '4QrzDhxuxZzH',
      'OE-TEMPLATE-ID': 'ep-23cXnH5UMpMz',
    },
    body: JSON.stringify({
      siteName: 'URDOC 虚拟病例研究平台',
      siteUrl: 'https://dev.urdoc.dearfad.com',
      // faceUrl: recordStore.record.face,
    }),
  })
  console.log(response)
}
</script>
