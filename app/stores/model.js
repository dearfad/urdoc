const CURRENT_VERSION = '2025-10-21'
export const useModelStore = defineStore(
  'model',
  () => {
    const version = ref(CURRENT_VERSION)
    const stateStore = useStateStore()
    const supabase = useSupabase()
    const userStore = useUserStore()

    const freeModels = ref({
      chat: [
        {
          provider: 'BIGMODEL',
          model: 'glm-4-flash-250414',
          thinking: false,
        },
        {
          provider: 'BIGMODEL',
          model: 'glm-4.5-flash',
          thinking: true,
        },
        {
          provider: 'XFYUN',
          model: 'lite',
          thinking: false,
        },
        {
          provider: 'TENCENT',
          model: 'hunyuan-lite',
          thinking: false,
        },
        {
          provider: 'INTERNAI',
          model: 'internlm3-8b-instruct',
          thinking: false,
        },
        {
          provider: 'INTERNAI',
          model: 'intern-s1',
          thinking: true,
        },
        {
          provider: 'INTERNAI',
          model: 'intern-s1-mini',
          thinking: true,
        },
        {
          provider: 'INTERNAI',
          model: 'internlm2.5-latest',
          thinking: false,
        },
      ],
      image: [
        {
          provider: 'BIGMODEL',
          model: 'cogview-3-flash',
          thinking: false,
        },
      ],
      video: [
        {
          provider: 'BIGMODEL',
          model: 'cogvideox-flash',
          thinking: false,
        },
      ],
    })

    const activeModels = ref({
      chat: {
        default: {
          source: 'free',
          provider: 'BIGMODEL',
          model: 'glm-4-flash-250414',
          thinking: false,
        },
        // case: {
        //   source: 'free',
        //   provider: 'BIGMODEL',
        //   model: 'glm-4-flash-250414',
        //   thinking: false,
        // },
        // story: {
        //   source: 'free',
        //   provider: 'BIGMODEL',
        //   model: 'glm-4-flash-250414',
        //   thinking: false,
        // },
        // test: {
        //   source: 'free',
        //   provider: 'BIGMODEL',
        //   model: 'glm-4-flash-250414',
        //   thinking: false,
        // },
        // act: {
        //   source: 'free',
        //   provider: 'BIGMODEL',
        //   model: 'glm-4-flash-250414',
        //   thinking: false,
        // },
        // rate: {
        //   source: 'free',
        //   provider: 'BIGMODEL',
        //   model: 'glm-4-flash-250414',
        //   thinking: false,
        // },
        // check: {
        //   source: 'free',
        //   provider: 'BIGMODEL',
        //   model: 'glm-4-flash-250414',
        //   thinking: false,
        // },
        // face: {
        //   source: 'free',
        //   provider: 'BIGMODEL',
        //   model: 'glm-4-flash-250414',
        //   thinking: false,
        // },
        // illustration: {
        //   source: 'free',
        //   provider: 'BIGMODEL',
        //   model: 'glm-4-flash-250414',
        //   thinking: false,
        // },
        // pose: {
        //   source: 'free',
        //   provider: 'BIGMODEL',
        //   model: 'glm-4-flash-250414',
        //   thinking: false,
        // },
        // conversation: {
        //   source: 'free',
        //   provider: 'BIGMODEL',
        //   model: 'glm-4-flash-250414',
        //   thinking: false,
        // },
        // discussion: {
        //   source: 'free',
        //   provider: 'BIGMODEL',
        //   model: 'glm-4-flash-250414',
        //   thinking: false,
        // },
      },
      image: {
        default: {
          source: 'free',
          provider: 'BIGMODEL',
          model: 'cogview-3-flash',
          thinking: false,
        },
        // face: {
        //   source: 'free',
        //   provider: 'BIGMODEL',
        //   model: 'cogview-3-flash',
        //   thinking: false,
        // },
        // illustration: {
        //   source: 'free',
        //   provider: 'BIGMODEL',
        //   model: 'cogview-3-flash',
        //   thinking: false,
        // },
      },
      video: {
        default: {
          source: 'free',
          provider: 'BIGMODEL',
          model: 'cogvideox-flash',
          thinking: false,
        },
        // pose: {
        //   source: 'free',
        //   provider: 'BIGMODEL',
        //   model: 'cogvideox-flash',
        //   thinking: false,
        // },
      },
      audio: {
        default: {
          source: 'custom',
          provider: 'GITEE',
          model: 'MOSS-TTSD-v0.5',
          thinking: false,
        },
        // dialogue: {
        //   source: 'custom',
        //   provider: 'GITEE',
        //   model: 'MOSS-TTSD-v0.5',
        //   thinking: false,
        // },
      },
    })

    const customModels = ref({
      chat: [],
      image: [],
      video: [],
    })

    const database = {
      async selectAll() {
        const { data, error } = await supabase.getData('models').selectAll()
        if (!error) {
          customModels.value = data[0].model
        }
        stateStore.appInfos.push(!error ? '刷新成功' : '刷新失败')
      },

      async upsert() {
        const { error } = await supabase.getData('models').upsert(
          {
            model: customModels.value,
            user_id: userStore.user.id,
          },
          'user_id'
        )
        stateStore.appInfos.push(!error ? '更新成功' : '更新失败')
      },
    }

    const PROVIDERS = [
      { name: '智谱', id: 'BIGMODEL' },
      { name: '腾讯混元', id: 'TENCENT' },
      { name: '讯飞云', id: 'XFYUN' },
      { name: '书生', id: 'INTERNAI' },
      { name: 'OPENROUTER', id: 'OPENROUTER' },
      { name: 'MODELSCOPE', id: 'MODELSCOPE' },
      { name: 'GITEE', id: 'GITEE' },
      { name: 'OLLAMA', id: 'OLLAMA' },
      { name: 'HUGGINGFACE', id: 'HUGGINGFACE' },
    ]

    const PROVIDER_COMPOSABLES_MAP = {
      BIGMODEL: useProviderBigModel(),
      TENCENT: useProviderTencent(),
      XFYUN: useProviderXfYun(),
      INTERNAI: useProviderInternAi(),
      OPENROUTER: useProviderOpenRouter(),
      MODELSCOPE: useProviderModelScope(),
      GITEE: useProviderGitee(),
      HUGGINGFACE: useProviderHuggingFace(),
      OLLAMA: useProviderOllama(),
    }

    function getProviderComposable(modelType, modelUsage) {
      return PROVIDER_COMPOSABLES_MAP[activeModels.value[modelType][modelUsage].provider]
    }

    const RESPONSE = {
      chat: {
        content: '',
        reasoning_content: '',
      },
      image: {
        url: '',
      },
      video: {
        url: '',
        cover_image_url: '',
      },
      audio: {
        url: '',
      },
    }

    const modelResponse = ref(RESPONSE)

    function resetResponse() {
      modelResponse.value = RESPONSE
    }

    return {
      version,
      freeModels,
      activeModels,
      customModels,
      PROVIDERS,
      database,
      getProviderComposable,
      modelResponse,
      resetResponse,
    }
  },
  {
    persist: {
      pick: ['version', 'activeModels', 'customModels', 'localModels', 'modelResponse'],
      serializer: {
        serialize: JSON.stringify,
        deserialize: (str) => {
          const data = JSON.parse(str)
          if (data.version !== CURRENT_VERSION) {
            localStorage.removeItem('model')
          } else {
            return data
          }
        },
      },
    },
  }
)
