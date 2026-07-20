const VERSION = '2026-07-20'
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
        provider: 'XiaoMI',
        name: 'mimo-v2.5-tts',
        apiKey: 'xiaomiApiKey',
        baseURL: 'https://api.xiaomimimo.com/v1',
      },
      video: {
        provider: 'Agnes',
        name: 'agnes-video-v2.0',
        apiKey: 'agnesApiKey',
        baseURL: 'https://apihub.agnes-ai.com/v1',
      },
    })

    const models = ref<Models>({
      chat: [
        {
          provider: 'InternAi',
          apiKey: 'shushengApiKey',
          baseURL: 'https://chat.intern-ai.org.cn/api/v1',
          models: ['intern-latest', 'intern-s1-pro', 'intern-s1'],
        },
        {
          provider: 'Agnes',
          apiKey: 'agnesApiKey',
          baseURL: 'https://apihub.agnes-ai.com/v1',
          models: ['agnes-2.0-flash'],
        },
        {
          provider: 'Makers',
          apiKey: 'makersModelsKey',
          baseURL: 'https://ai-gateway.edgeone.link/v1',
          models: [
            '@makers/hy3',
            '@makers/hy3-preview',
            '@makers/deepseek-v4-pro',
            '@makers/deepseek-v4-flash',
            '@makers/minimax-m3',
            '@makers/minimax-m2.7',
            '@makers/kimi-k2.6',
          ],
        },
      ],
      image: [
        {
          provider: 'BigModel',
          apiKey: 'zhipuApiKey',
          baseURL: 'https://open.bigmodel.cn/api/paas/v4',
          models: ['cogview-3-flash'],
        },
        {
          provider: 'Agnes',
          apiKey: 'agnesApiKey',
          baseURL: 'https://apihub.agnes-ai.com/v1',
          models: ['agnes-image-2.0-flash', 'agnes-image-2.1-flash'],
        },
      ],
      audio: [
        {
          provider: 'Gitee',
          apiKey: 'giteeApiKey',
          baseURL: 'https://api.moark.com/v1',
          models: ['Spark-TTS-0.5B'],
        },
        {
          provider: 'XiaoMI',
          apiKey: 'xiaomiApiKey',
          baseURL: 'https://api.xiaomimimo.com/v1',
          models: ['mimo-v2.5-tts'],
        },
      ],
      video: [
        {
          provider: 'Agnes',
          apiKey: 'agnesApiKey',
          baseURL: 'https://apihub.agnes-ai.com/v1',
          models: ['agnes-video-v2.0'],
        },
      ],
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
