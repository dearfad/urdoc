export const useApiKeyStore = defineStore(
  'apikey',
  () => {
    const stateStore = useStateStore()
    // 键值唯一
    const apiKeys = ref({})
    const add = async (key, value) => {
      const maskedValue = await $fetch('/api/mask', {
        baseURL: stateStore.apiBaseUrl,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          params: {
            mask: true,
            apiKey: value,
          },
        },
      })
      apiKeys.value[key] = maskedValue
    }
    return { apiKeys, add }
  },
  {
    persist: true,
  }
)
