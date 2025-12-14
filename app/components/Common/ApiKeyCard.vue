<template>
  <v-card hover class="px-4" rounded="lg" :isloading="isLoading">
    <v-select
      v-model="provider"
      label="Api Keys"
      :items="modelStore.PROVIDERS"
      item-title="name"
      item-value="id"
      variant="outlined"
      class="my-4"
      hide-details="auto"
      density="comfortable"
    />
    <v-text-field v-model="apiKey" variant="outlined" label="API_KEY" :disabled="!isUseApiKey" />
    <v-text-field
      v-model="apiKeyName"
      variant="outlined"
      label="API_KEY_NAME"
      :disabled="!isUseApiKeyName"
    />
    <v-card-actions>
      <v-spacer />
      <v-btn text="更新" @click="addApiKey" />
      <v-btn text="删除" @click="deleteApiKey" />
    </v-card-actions>
  </v-card>
</template>

<script setup>
const modelStore = useModelStore()
const apiKeyStore = useApiKeyStore()
const provider = ref('')
const apiKey = ref('')
const apiKeyName = ref('')
const userApiKeyName = computed(() => `USER_${provider.value}_API_KEY`)
const isLoading = ref(false)
const isUseApiKey = computed(() => (apiKey.value || !apiKeyName.value ? true : false))
const isUseApiKeyName = computed(() => (apiKeyName.value || !apiKey.value ? true : false))

watch(provider, (newProvider) => {
  if (newProvider) {
    apiKey.value = apiKeyStore.apiKeys[userApiKeyName.value]?.apiKey || ''
    apiKeyName.value = apiKeyStore.apiKeys[userApiKeyName.value]?.apiKeyName || ''
  }
})

async function addApiKey() {
  isLoading.value = true
  if (provider.value) {
    await apiKeyStore.add(userApiKeyName.value, apiKey.value, apiKeyName.value)
  }
  isLoading.value = false
}

function deleteApiKey() {
  if (provider.value) {
    apiKeyStore.del(userApiKeyName.value)
    apiKey.value = ''
    apiKeyName.value = ''
  }
}
</script>
