const CURRENT_VERSION = '2025-10-20'
export const useApiKeyStore = defineStore(
  'apikey',
  () => {
    const version = ref(CURRENT_VERSION)
    const stateStore = useStateStore()
    // 键值唯一
    const apiKeys = ref({})
    const add = async (userApiKeyName, apiKey, apiKeyName) => {
      apiKeys.value[userApiKeyName] = {
        apiKey: '',
        apiKeyName: '',
      }
      try {
        if (apiKey) {
          const maskedValue = await $fetch('/utils/mask', {
            baseURL: stateStore.apiBaseUrl,
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: {
              payload: {
                mask: true,
                apiKey: apiKey,
              },
            },
          })
          apiKeys.value[userApiKeyName].apiKey = maskedValue
        } else {
          apiKeys.value[userApiKeyName].apiKey = ''
        }

        apiKeys.value[userApiKeyName].apiKeyName = apiKeyName
      } catch (error) {
        console.error(error)
        stateStore.appInfos.push('添加失败: ', error)
      }
    }

    const del = (userApiKeyName) => {
      apiKeys.value[userApiKeyName] = {
        apiKey: '',
        apiKeyName: '',
      }
    }

    return { version, apiKeys, add, del }
  },
  {
    persist: {
      serializer: {
        serialize: JSON.stringify,
        deserialize: (str) => {
          const data = JSON.parse(str)
          if (data.version !== CURRENT_VERSION) {
            localStorage.removeItem('apikey')
          } else {
            return data
          }
        },
      },
    },
  }
)
