<template>
  <v-card hover class="px-4" rounded="lg">
    <v-select
      v-model="selectedSite"
      label="镜像站点"
      :items="providerStore.sites"
      item-title="name"
      :hint="'最后更新日期：' + lastCommitDate[selectedSite.branch]"
      persistent-hint
      variant="outlined"
      density="comfortable"
      return-object
      class="mt-4"
    />
    <v-card-actions>
      <v-btn class="ml-auto" text="访问" :href="selectedSite.url" />
    </v-card-actions>
  </v-card>
</template>

<script setup>
const providerStore = useProviderStore()
const stateStore = useStateStore()
const selectedSite = ref(providerStore.sites[0])
const lastCommitDate = ref({
  main: '',
  develop: '',
})

async function getLastCommitDate(branch) {
  const params = {
    url: `https://api.github.com/repos/dearfad/urdoc/commits/${branch}`,
    method: 'GET',
    apiKeyName: 'GITHUB_API_TOKEN',
    headers: {
      'Content-Type': 'application/vnd.github+json',
      'User-Agent': 'urdoc',
    },
  }
  const response = await $fetch('/fetch', {
    baseURL: stateStore.apiBaseUrl,
    method: 'POST',
    body: {
      params: params,
    },
  })
  const utcDate = new Date(response.commit.committer.date)
  const beijingDateStr = utcDate.toLocaleDateString('zh-CN', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
  const formattedDate = beijingDateStr.replace(/\//g, '-')
  return formattedDate
}

onMounted(async () => {
  lastCommitDate.value.main = await getLastCommitDate('main')
  lastCommitDate.value.develop = await getLastCommitDate('develop')
})
</script>
