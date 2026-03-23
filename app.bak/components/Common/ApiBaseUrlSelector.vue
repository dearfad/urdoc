<template>
  <v-card hover class="px-4" rounded="lg">
    <ClientOnly>
      <v-select
        v-model="stateStore.apiBaseUrl"
        label="接口地址"
        :items="providerStore.apiBaseUrls"
        item-title="name"
        item-value="url"
        variant="outlined"
        class="my-4"
        hide-details="auto"
        density="comfortable"
      />
    </ClientOnly>
  </v-card>
</template>

<script setup>
const stateStore = useStateStore()
const providerStore = useProviderStore()
</script>
