<template>
  <v-sheet class="px-4 my-3" elevation="4" rounded="lg">
    <v-select
      v-model="selectedSite"
      label="镜像站点"
      :items="providerStore.sites"
      item-title="name"
      variant="outlined"
      class="my-4"
      hide-details="auto"
      density="comfortable"
      return-object
    />
    <v-btn
      size="large"
      class="font-weight-bold my-5"
      elevation="4"
      rounded="lg"
      text="跳转"
      block
      :href="selectedSite.url"
    />
  </v-sheet>
</template>

<script setup>
const providerStore = useProviderStore()
const selectedSite = ref(providerStore.sites[0])
</script>
