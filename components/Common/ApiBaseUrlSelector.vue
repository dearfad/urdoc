<template>
  <v-sheet class="px-4 my-3" elevation="4" rounded="lg">
    <v-select
      v-model="stateStore.apiBaseUrl"
      label="API Base URL"
      :items="providerStore.apiBaseUrls"
      item-title="name"
      item-value="url"
      variant="outlined"
      class="my-4"
      hide-details="auto"
      density="comfortable"
    />
  </v-sheet>
</template>

<script setup>
const stateStore = useStateStore()
const providerStore = useProviderStore()
</script>
