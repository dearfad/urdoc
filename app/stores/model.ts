const VERSION = '2026-05-19'
export const useModelStore = defineStore(
  'model',
  () => {
    const version = ref(VERSION)
    syncStoreVersion(VERSION, 'pinia:model')

    const activeModels = ref<ActiveModels>({
      chat: {
        provider: 'InternAi',
        name: 'intern-s1',
        apiKey: 'shushengApiKey',
        baseURL: 'https://chat.intern-ai.org.cn/api/v1',
      },
      image: {
        provider: 'Agnes',
        name: 'agnes-image-2.1-flash',
        apiKey: 'agnesApiKey',
        baseURL: 'https://apihub.agnes-ai.com/v1',
      },
      audio: {
        provider: 'InternAi',
        name: 'intern-s1',
        apiKey: 'shushengApiKey',
        baseURL: 'https://chat.intern-ai.org.cn/api/v1',
      },
      video: {
        provider: 'InternAi',
        name: 'intern-s1',
        apiKey: 'shushengApiKey',
        baseURL: 'https://chat.intern-ai.org.cn/api/v1',
      },
    })

    const models = ref<Models>({
      chat: [
        {
          provider: 'InternAi',
          apiKey: 'shushengApiKey',
          baseURL: 'https://chat.intern-ai.org.cn/api/v1',
          models: ['intern-latest', 'intern-s1'],
        },
        {
          provider: 'LongCat',
          apiKey: 'longcatApiKey',
          baseURL: 'https://api.longcat.chat/openai/v1',
          models: ['LongCat-Flash-Lite', 'LongCat-Flash-Chat'],
        },
        {
          provider: 'Agnes',
          apiKey: 'agnesApiKey',
          baseURL: 'https://apihub.agnes-ai.com/v1',
          models: ['agnes-1.5-flash', 'agnes-2.0-flash'],
        },
      ],
      image: [
        {
          provider: 'Agnes',
          apiKey: 'agnesApiKey',
          baseURL: 'https://apihub.agnes-ai.com/v1',
          models: ['agnes-image-2.1-flash'],
        },
      ],
      audio: [],
      video: [],
    })

    return {
      version,
      activeModels,
      models,
    }
  },
  {
    unstorage: {
      pick: [], // string[], state keys picked to storage
      omit: ['models'], // string[], state keys omitted fot storage
    },
  },
)
