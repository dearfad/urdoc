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
  return await $fetch('/github/last-commit', {
    baseURL: stateStore.apiBaseUrl,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: {
      branch: branch,
    },
  })
}

onMounted(async () => {
  lastCommitDate.value.main = await getLastCommitDate('main')
  lastCommitDate.value.develop = await getLastCommitDate('develop')
})
</script>
