export const useApiKeyStore = defineStore(
  'apikey',
  () => {
    const stateStore = useStateStore()
    // 键值唯一
    const apiKeys = ref({})
    const add = async (key, value) => {
      if (!value || value === '') {
        apiKeys.value[key] = ''
        return
      }
      try {
        const maskedValue = await $fetch('/utils/mask', {
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
      } catch (error) {
        console.error(error)
        stateStore.appInfos.push('添加失败: ', error)
      }
    }
    return { apiKeys, add }
  },
  {
    persist: true,
  }
)
