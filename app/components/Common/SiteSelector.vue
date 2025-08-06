<template>
  <v-card hover class="px-4" rounded="lg">
    <v-select
      v-model="selectedSite"
      label="镜像站点"
      :items="providerStore.sites"
      item-title="name"
      variant="outlined"
      hide-details="auto"
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
const selectedSite = ref(providerStore.sites[0])
</script>
