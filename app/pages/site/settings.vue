<template>
  <div class="d-flex flex-column w-100 w-md-75 mx-auto my-4 px-2 ga-4">
    <CommonApiBaseUrlSelector />
    <CommonSiteSelector />
    <CommonApiKeyCard />
    <v-btn block text="清除缓存" size="large" @click="clearLocalStorage" />
    <!-- <v-btn
      v-tooltip="'debug'"
      icon="mdi-bug-play-outline"
      variant="plain"
      :ripple="false"
      @click="stateStore.isDebug = !stateStore.isDebug"
    />
    <v-btn
      v-tooltip="'开关底部导航'"
      icon="mdi-filter-variant"
      variant="plain"
      :ripple="false"
      @click="stateStore.isBottomNavigationShow = !stateStore.isBottomNavigationShow"
    />
    <v-btn
      v-tooltip="'开关应用页脚'"
      icon="mdi-format-vertical-align-bottom"
      variant="plain"
      :ripple="false"
      @click="stateStore.isAppFooterShow = !stateStore.isAppFooterShow"
    /> -->
    <!-- <div class="d-flex mx-auto ga-12">
      <v-img :src="badgeSrc.main" width="auto" height="20" />
      <v-img :src="badgeSrc.develop" width="auto" height="20" />
    </div> -->
  </div>
</template>

<script setup>
definePageMeta({
  title: '站点设置',
})

function clearLocalStorage() {
  localStorage.clear()
}
// const stateStore = useStateStore()
// const badgeSrc = ref({
//   main: '',
//   develop: '',
// })
// 最后提交时间

// async function getBadge(branch) {
//   const params = {
//     url: `https://api.github.com/repos/dearfad/urdoc/commits/${branch}`,
//     method: 'GET',
//     apiKeyName: 'GITHUB_API_TOKEN',
//     headers: {
//       'Content-Type': 'application/vnd.github+json',
//       'User-Agent': 'urdoc',
//     },
//   }
//   const response = await $fetch('/fetch', {
//     baseURL: stateStore.apiBaseUrl,
//     method: 'POST',
//     body: {
//       params: params,
//     },
//   })
//   const utcDate = new Date(response.commit.committer.date)
//   const beijingDateStr = utcDate.toLocaleDateString('zh-CN', {
//     timeZone: 'Asia/Shanghai',
//     year: 'numeric',
//     month: '2-digit',
//     day: '2-digit',
//   })
//   const formattedDate = beijingDateStr.replace(/\//g, '--')
//   badgeSrc.value[
//     branch
//   ] = `https://img.shields.io/badge/${formattedDate}-虚拟病例研究平台-blue?style=social&logo=github`
// }

// onMounted(async () => {
//   await getBadge('main')
//   await getBadge('develop')
// })
</script>
