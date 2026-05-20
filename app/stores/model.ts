const VERSION = '2026-05-19'
export const useModelStore = defineStore(
  'model',
  () => {
    const version = ref(VERSION)
    syncStoreVersion(VERSION, 'pinia:model')

    const activeModels = ref<ActiveModels>({
      case: {
        provider: 'InternAi',
        name: 'intern-s1',
        apiKey: 'shushengApiKey',
        baseURL: 'https://chat.intern-ai.org.cn/api/v1',
      },
      story: {
        provider: 'InternAi',
        name: 'intern-s1',
        apiKey: 'shushengApiKey',
        baseURL: 'https://chat.intern-ai.org.cn/api/v1',
      },
      test: {
        provider: 'InternAi',
        name: 'intern-s1',
        apiKey: 'shushengApiKey',
        baseURL: 'https://chat.intern-ai.org.cn/api/v1',
      },
      act: {
        provider: 'InternAi',
        name: 'intern-s1',
        apiKey: 'shushengApiKey',
        baseURL: 'https://chat.intern-ai.org.cn/api/v1',
      },
      rate: {
        provider: 'InternAi',
        name: 'intern-s1',
        apiKey: 'shushengApiKey',
        baseURL: 'https://chat.intern-ai.org.cn/api/v1',
      },
    })

    const models = ref<Models>([
      {
        provider: 'InternAi',
        name: 'intern-s1',
        apiKey: 'shushengApiKey',
        baseURL: 'https://chat.intern-ai.org.cn/api/v1',
      },
      {
        provider: 'OpenRouter',
        name: 'google/gemma-4-26b-a4b-it:free',
        apiKey: 'openrouterApiKey',
        baseURL: 'https://openrouter.ai/api/v1',
      },
      {
        provider: 'OpenRouter',
        name: 'baidu/cobuddy:free',
        apiKey: 'openrouterApiKey',
        baseURL: 'https://openrouter.ai/api/v1',
      },
      {
        provider: 'OpenRouter',
        name: 'nvidia/nemotron-3-super-120b-a12b:free',
        apiKey: 'openrouterApiKey',
        baseURL: 'https://openrouter.ai/api/v1',
      },
      {
        provider: 'OpenRouter',
        name: 'openai/gpt-oss-120b:free',
        apiKey: 'openrouterApiKey',
        baseURL: 'https://openrouter.ai/api/v1',
      },
      {
        provider: 'OpenRouter',
        name: 'z-ai/glm-4.5-air:free',
        apiKey: 'openrouterApiKey',
        baseURL: 'https://openrouter.ai/api/v1',
      },
      {
        provider: 'OpenRouter',
        name: 'deepseek/deepseek-v4-flash:free',
        apiKey: 'openrouterApiKey',
        baseURL: 'https://openrouter.ai/api/v1',
      },
    ])
    // const stateStore = useStateStore()
    // const supabase = useSupabase()
    // const userStore = useUserStore()

    // const freeModels = ref({
    //   chat: [
    //     {
    //       provider: 'BIGMODEL',
    //       model: 'glm-4-flash-250414',
    //       thinking: false,
    //     },
    //     {
    //       provider: 'BIGMODEL',
    //       model: 'glm-4.5-flash',
    //       thinking: true,
    //     },
    //     {
    //       provider: 'BIGMODEL',
    //       model: 'glm-4.7-flash',
    //       thinking: true,
    //     },
    //     {
    //       provider: 'XFYUN',
    //       model: 'lite',
    //       thinking: false,
    //     },
    //     {
    //       provider: 'TENCENT',
    //       model: 'hunyuan-lite',
    //       thinking: false,
    //     },
    //     {
    //       provider: 'INTERNAI',
    //       model: 'internlm3-8b-instruct',
    //       thinking: false,
    //     },
    //     {
    //       provider: 'INTERNAI',
    //       model: 'intern-s1',
    //       thinking: true,
    //     },
    //     {
    //       provider: 'INTERNAI',
    //       model: 'intern-s1-mini',
    //       thinking: true,
    //     },
    //     {
    //       provider: 'INTERNAI',
    //       model: 'internlm2.5-latest',
    //       thinking: false,
    //     },
    //     {
    //       provider: 'NVIDIA',
    //       model: 'deepseek-ai/deepseek-v3.2',
    //       thinking: true,
    //     },
    //     {
    //       provider: 'NVIDIA',
    //       model: 'moonshotai/kimi-k2-instruct',
    //       thinking: true,
    //     },
    //     {
    //       provider: 'NVIDIA',
    //       model: 'meta/llama-4-maverick-17b-128e-instruct',
    //       thinking: true,
    //     },
    //     {
    //       provider: 'LONGCAT',
    //       model: 'LongCat-Flash-Chat',
    //       thinking: false,
    //     },
    //     {
    //       provider: 'LONGCAT',
    //       model: 'LongCat-Flash-Thinking',
    //       thinking: true,
    //     },
    //     {
    //       provider: 'LONGCAT',
    //       model: 'LongCat-Flash-Thinking-2601',
    //       thinking: true,
    //     },
    //     {
    //       provider: 'IFLOW',
    //       model: 'tstars2.0',
    //       thinking: true,
    //     },
    //   ],
    //   image: [
    //     {
    //       provider: 'BIGMODEL',
    //       model: 'cogview-3-flash',
    //       thinking: false,
    //     },
    //   ],
    //   video: [
    //     {
    //       provider: 'BIGMODEL',
    //       model: 'cogvideox-flash',
    //       thinking: false,
    //     },
    //   ],
    // })

    // const activeModels = ref({
    //   chat: {
    //     default: {
    //       source: 'free',
    //       provider: 'BIGMODEL',
    //       model: 'glm-4-flash-250414',
    //       thinking: false,
    //     },
    //     // case: {
    //     //   source: 'free',
    //     //   provider: 'BIGMODEL',
    //     //   model: 'glm-4-flash-250414',
    //     //   thinking: false,
    //     // },
    //     // story: {
    //     //   source: 'free',
    //     //   provider: 'BIGMODEL',
    //     //   model: 'glm-4-flash-250414',
    //     //   thinking: false,
    //     // },
    //     // test: {
    //     //   source: 'free',
    //     //   provider: 'BIGMODEL',
    //     //   model: 'glm-4-flash-250414',
    //     //   thinking: false,
    //     // },
    //     // act: {
    //     //   source: 'free',
    //     //   provider: 'BIGMODEL',
    //     //   model: 'glm-4-flash-250414',
    //     //   thinking: false,
    //     // },
    //     // rate: {
    //     //   source: 'free',
    //     //   provider: 'BIGMODEL',
    //     //   model: 'glm-4-flash-250414',
    //     //   thinking: false,
    //     // },
    //     // check: {
    //     //   source: 'free',
    //     //   provider: 'BIGMODEL',
    //     //   model: 'glm-4-flash-250414',
    //     //   thinking: false,
    //     // },
    //     // face: {
    //     //   source: 'free',
    //     //   provider: 'BIGMODEL',
    //     //   model: 'glm-4-flash-250414',
    //     //   thinking: false,
    //     // },
    //     // illustration: {
    //     //   source: 'free',
    //     //   provider: 'BIGMODEL',
    //     //   model: 'glm-4-flash-250414',
    //     //   thinking: false,
    //     // },
    //     // pose: {
    //     //   source: 'free',
    //     //   provider: 'BIGMODEL',
    //     //   model: 'glm-4-flash-250414',
    //     //   thinking: false,
    //     // },
    //     // conversation: {
    //     //   source: 'free',
    //     //   provider: 'BIGMODEL',
    //     //   model: 'glm-4-flash-250414',
    //     //   thinking: false,
    //     // },
    //     // discussion: {
    //     //   source: 'free',
    //     //   provider: 'BIGMODEL',
    //     //   model: 'glm-4-flash-250414',
    //     //   thinking: false,
    //     // },
    //   },
    //   image: {
    //     default: {
    //       source: 'free',
    //       provider: 'BIGMODEL',
    //       model: 'cogview-3-flash',
    //       thinking: false,
    //     },
    //     // face: {
    //     //   source: 'free',
    //     //   provider: 'BIGMODEL',
    //     //   model: 'cogview-3-flash',
    //     //   thinking: false,
    //     // },
    //     // illustration: {
    //     //   source: 'free',
    //     //   provider: 'BIGMODEL',
    //     //   model: 'cogview-3-flash',
    //     //   thinking: false,
    //     // },
    //   },
    //   video: {
    //     default: {
    //       source: 'free',
    //       provider: 'BIGMODEL',
    //       model: 'cogvideox-flash',
    //       thinking: false,
    //     },
    //     // pose: {
    //     //   source: 'free',
    //     //   provider: 'BIGMODEL',
    //     //   model: 'cogvideox-flash',
    //     //   thinking: false,
    //     // },
    //   },
    //   audio: {
    //     default: {
    //       source: 'custom',
    //       provider: 'GITEE',
    //       model: 'IndexTTS-2',
    //       thinking: false,
    //     },
    //     // dialogue: {
    //     //   source: 'custom',
    //     //   provider: 'GITEE',
    //     //   model: 'MOSS-TTSD-v0.5',
    //     //   thinking: false,
    //     // },
    //   },
    // })

    // const customModels = ref({
    //   chat: [],
    //   image: [],
    //   video: [],
    // })

    // const database = {
    //   async selectAll() {
    //     const { data, error } = await supabase.getData('models').selectAll()
    //     if (!error) {
    //       customModels.value = data[0].model
    //     }
    //     stateStore.appInfos.push(!error ? '刷新成功' : '刷新失败')
    //   },

    //   async upsert() {
    //     const { error } = await supabase.getData('models').upsert(
    //       {
    //         model: customModels.value,
    //         user_id: userStore.user.id,
    //       },
    //       'user_id',
    //     )
    //     stateStore.appInfos.push(!error ? '更新成功' : '更新失败')
    //   },
    // }

    // const PROVIDERS = [
    //   { name: '智谱', id: 'BIGMODEL' },
    //   { name: '腾讯混元', id: 'TENCENT' },
    //   { name: '讯飞云', id: 'XFYUN' },
    //   { name: '书生', id: 'INTERNAI' },
    //   { name: 'OPENROUTER', id: 'OPENROUTER' },
    //   { name: 'MODELSCOPE', id: 'MODELSCOPE' },
    //   { name: 'GITEE', id: 'GITEE' },
    //   { name: 'OLLAMA', id: 'OLLAMA' },
    //   { name: 'HUGGINGFACE', id: 'HUGGINGFACE' },
    //   { name: 'NVIDIA', id: 'NVIDIA' },
    //   { name: 'LONGCAT', id: 'LONGCAT' },
    //   { name: 'IFLOW', id: 'IFLOW' },
    // ]

    // const PROVIDER_COMPOSABLES_MAP = {
    //   BIGMODEL: useProviderBigModel(),
    //   TENCENT: useProviderTencent(),
    //   XFYUN: useProviderXfYun(),
    //   INTERNAI: useProviderInternAi(),
    //   OPENROUTER: useProviderOpenRouter(),
    //   MODELSCOPE: useProviderModelScope(),
    //   GITEE: useProviderGitee(),
    //   HUGGINGFACE: useProviderHuggingFace(),
    //   OLLAMA: useProviderOllama(),
    //   NVIDIA: useProviderNvidia(),
    //   LONGCAT: useProviderLongCat(),
    //   IFLOW: useProviderIFlow(),
    // }

    // function getProviderComposable(modelType, modelUsage) {
    //   return PROVIDER_COMPOSABLES_MAP[
    //     activeModels.value[modelType][modelUsage]
    //       ? activeModels.value[modelType][modelUsage].provider
    //       : activeModels.value[modelType]['default'].provider
    //   ]
    // }

    // const RESPONSE = {
    //   chat: {
    //     content: '',
    //     reasoning_content: '',
    //   },
    //   image: {
    //     url: '',
    //   },
    //   video: {
    //     url: '',
    //     cover_image_url: '',
    //   },
    //   audio: {
    //     url: '',
    //   },
    // }

    // const modelResponse = ref(RESPONSE)

    // function resetResponse() {
    //   modelResponse.value = RESPONSE
    // }

    return {
      version,
      activeModels,
      models,
      // freeModels,
      // activeModels,
      // customModels,
      // PROVIDERS,
      // database,
      // getProviderComposable,
      // modelResponse,
      // resetResponse,
    }
  },
  {
    unstorage: {
      pick: [], // string[], state keys picked to storage
      omit: ['models'], // string[], state keys omitted fot storage
    },
  },
)
