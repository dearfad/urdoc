export const useApiKeyStore = defineStore(
  'apikey',
  () => {
    const apiKeys = ref({})
    return { apiKeys }
  },
  {
    persist: true,
  }
)
