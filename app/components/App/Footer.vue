<template>
  <v-footer v-if="stateStore.isAppFooterShow" app class="py-2">
    <div class="d-flex mx-auto">
      <v-img :src="badgeSrc" width="auto" height="20" />
    </div>
  </v-footer>
</template>

<script setup>
const stateStore = useStateStore()
const badgeSrc = ref(
  'https://img.shields.io/badge/2025-虚拟病例研究平台-blue?style=social&logo=github'
)
// 最后提交时间
// onMounted(async () => {
//   const data = await $fetch('/utils/commit', {
//     baseURL: stateStore.apiBaseUrl,
//   })
//   const utcDate = new Date(data)
//   const beijingDateStr = utcDate.toLocaleDateString('zh-CN', {
//     timeZone: 'Asia/Shanghai',
//     year: 'numeric',
//     month: '2-digit',
//     day: '2-digit',
//   })
//   const formattedDate = beijingDateStr.replace(/\//g, '--')
//   badgeSrc.value = `https://img.shields.io/badge/${formattedDate}-虚拟病例研究平台-blue?style=social&logo=github`
// })
</script>
