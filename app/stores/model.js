export const useModelStore = defineStore(
  'model',
  () => {
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
        case: {
          source: 'free',
          provider: 'BIGMODEL',
          model: 'glm-4-flash-250414',
          thinking: false,
        },
        story: {
          source: 'free',
          provider: 'BIGMODEL',
          model: 'glm-4-flash-250414',
          thinking: false,
        },
        test: {
          source: 'free',
          provider: 'BIGMODEL',
          model: 'glm-4-flash-250414',
          thinking: false,
        },
        act: {
          source: 'free',
          provider: 'BIGMODEL',
          model: 'glm-4-flash-250414',
          thinking: false,
        },
        rate: {
          source: 'free',
          provider: 'BIGMODEL',
          model: 'glm-4-flash-250414',
          thinking: false,
        },
        check: {
          source: 'free',
          provider: 'BIGMODEL',
          model: 'glm-4-flash-250414',
          thinking: false,
        },
        face: {
          source: 'free',
          provider: 'BIGMODEL',
          model: 'glm-4-flash-250414',
          thinking: false,
        },
        illustration: {
          source: 'free',
          provider: 'BIGMODEL',
          model: 'glm-4-flash-250414',
          thinking: false,
        },
        pose: {
          source: 'free',
          provider: 'BIGMODEL',
          model: 'glm-4-flash-250414',
          thinking: false,
        },
      },
      image: {
        face: {
          source: 'free',
          provider: 'BIGMODEL',
          model: 'cogview-3-flash',
          thinking: false,
        },
        illustration: {
          source: 'free',
          provider: 'BIGMODEL',
          model: 'cogview-3-flash',
          thinking: false,
        },
      },
      video: {
        pose: {
          source: 'free',
          provider: 'BIGMODEL',
          model: 'cogvideox-flash',
          thinking: false,
        },
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
    ]

    const PROVIDER_COMPOSABLES_MAP = {
      BIGMODEL: useProviderBigModel(),
      TENCENT: useProviderTencent(),
      XFYUN: useProviderXfYun(),
      INTERNAI: useProviderInternAi(),
      OPENROUTER: useProviderOpenRouter(),
      MODELSCOPE: useProviderModelScope(),
      GITEE: useProviderGitee(),
    }

    function getProviderComposable(modelType, modelUsage) {
      return PROVIDER_COMPOSABLES_MAP[activeModels.value[modelType][modelUsage].provider]
    }

    const modelResponse = ref({
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
    })

    return {
      freeModels,
      activeModels,
      customModels,
      PROVIDERS,
      database,
      getProviderComposable,
      modelResponse,
    }
  },
  {
    persist: {
      pick: ['activeModels', 'customModels'],
    },
  }
)
