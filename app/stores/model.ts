const VERSION = '2026-11-02'
export const useModelStore = defineStore(
  'model',
  () => {
    const version = ref(VERSION)
    syncStoreVersion(VERSION, 'pinia:model')

    const activeModels = ref<ActiveModels>({
      chat: {
        provider: 'Agnes',
        name: 'agnes-2.5-flash',
        apiKey: 'agnesApiKey',
        baseURL: 'https://api.agnes-ai.cn/v1',
      },
      image: {
        provider: 'Agnes',
        name: 'agnes-image-2.1-flash',
        apiKey: 'agnesApiKey',
        baseURL: 'https://api.agnes-ai.cn/v1',
      },
      audio: {
        provider: 'XiaoMI',
        name: 'mimo-v2.5-tts',
        apiKey: 'xiaomiApiKey',
        baseURL: 'https://api.xiaomimimo.com/v1',
      },
      video: {
        provider: 'Agnes',
        name: 'agnes-video-2.5-flash',
        apiKey: 'agnesApiKey',
        baseURL: 'https://api.agnes-ai.cn/v1',
      },
    })

    const modelsBase = ref<Models>({
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
          baseURL: 'https://api.agnes-ai.cn/v1',
          models: ['agnes-2.5-flash', 'agnes-3.0-flash'],
        },
        // {
        //   provider: 'Makers',
        //   apiKey: 'makersModelsKey',
        //   baseURL: 'https://ai-gateway.edgeone.link/v1',
        //   models: [
        //     '@makers/hy3',
        //     '@makers/hy3-preview',
        //     '@makers/deepseek-v4-pro',
        //     '@makers/deepseek-v4-flash',
        //     '@makers/minimax-m3',
        //     '@makers/minimax-m2.7',
        //     '@makers/kimi-k2.6',
        //   ],
        // },
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
          baseURL: 'https://api.agnes-ai.cn/v1',
          models: ['agnes-image-2.0-flash', 'agnes-image-2.1-flash', 'agnes-image-2.5-flash'],
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
          baseURL: 'https://api.agnes-ai.cn/v1',
          models: ['agnes-video-2.5-flash'],
        },
      ],
    })

    // 用户自定义模型配置（按场景持久化保存）
    const customModels = ref<CustomModels>({
      chat: { apiKey: '', baseURL: '', modelName: '' },
      image: { apiKey: '', baseURL: '', modelName: '' },
      audio: { apiKey: '', baseURL: '', modelName: '' },
      video: { apiKey: '', baseURL: '', modelName: '' },
    })

    // 合并默认列表与自定义 Custom 提供商，供模型选择器使用
    const models = computed<Models>(() => {
      const result = {} as Models
      for (const scene of Object.keys(modelsBase.value) as (keyof CustomModels)[]) {
        const list = [...(modelsBase.value[scene] ?? [])]
        const custom = customModels.value[scene]
        if (custom?.modelName?.trim()) {
          list.push({
            provider: 'Custom',
            apiKey: custom.apiKey,
            baseURL: custom.baseURL,
            models: [custom.modelName.trim()],
          })
        }
        result[scene] = list
      }
      return result
    })

    return {
      version,
      activeModels,
      customModels,
      models,
    }
  },
  {
    unstorage: {
      pick: [], // string[], state keys picked to storage
      omit: ['models'], // string[], state keys omitted fot storage（models 为派生值，无需持久化）
    },
  },
)
