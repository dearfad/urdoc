export const useModelStore = defineStore(
  'model',
  () => {
    const stateStore = useStateStore()
    const supabase = useSupabase()
    const userStore = useUserStore()

    const DEFAULT_PROVIDER_ID = [
      {
        name: '智谱',
        id: 'ZHIPU',
      },
      {
        name: '讯飞',
        id: 'XUNFEI',
      },
      {
        name: '腾讯',
        id: 'TENCENT',
      },
      {
        name: '书生',
        id: 'SHUSHENG',
      },
      {
        name: 'OpenRouter',
        id: 'OPENROUTER',
      },
      {
        name: 'Pollinations',
        id: 'POLLINATIONS',
      },
      {
        name: 'ModelScope',
        id: 'MODELSCOPE',
      },
      {
        name: 'Baidu',
        id: 'BAIDU',
      },
      {
        name: '豆包',
        id: 'DOUBAO',
      },
      {
        name: '阿里云',
        id: 'ALIYUN',
      },
    ]

    const DEFAULT_ENDPOINT = {
      ZHIPU: {
        chat: 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
        image: 'https://open.bigmodel.cn/api/paas/v4/images/generations',
        video: 'https://open.bigmodel.cn/api/paas/v4/videos/generations',
        result: 'https://open.bigmodel.cn/api/paas/v4/async-result/',
      },
      XUNFEI: {
        chat: 'https://spark-api-open.xf-yun.com/v1/chat/completions',
      },
      TENCENT: {
        chat: 'https://api.hunyuan.cloud.tencent.com/v1/chat/completions',
      },
      SHUSHENG: {
        chat: 'https://chat.intern-ai.org.cn/api/v1/chat/completions',
      },
      OPENROUTER: {
        chat: 'https://openrouter.ai/api/v1/chat/completions',
        image: 'https://openrouter.ai/api/v1/chat/completions',
      },
      POLLINATIONS: {
        chat: 'https://text.pollinations.ai/openai',
      },
      MODELSCOPE: {
        chat: 'https://api-inference.modelscope.cn/v1/chat/completions',
      },
      BAIDU: {
        chat: 'https://qianfan.baidubce.com/v2/chat/completions',
      },
      DOUBAO: {
        chat: 'https://ark.cn-beijing.volces.com/api/v3/chat/completions',
      },
      ALIYUN: {
        chat: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
      },
    }

    const DEFAULT_API_KEY_NAME = {
      ZHIPU: 'ZHIPU_API_KEY',
      XUNFEI: 'XFYUN_API_KEY',
      TENCENT: 'HUNYUAN_API_KEY',
      SHUSHENG: 'SHUSHENG_API_KEY',
    }

    const defaultModels = ref([
      {
        provider: '智谱',
        type: 'chat',
        endpoint: DEFAULT_ENDPOINT.ZHIPU.chat,
        model: 'glm-4-flash-250414',
        apiKeyName: DEFAULT_API_KEY_NAME.ZHIPU,
      },
      {
        provider: '智谱',
        type: 'chat',
        endpoint: DEFAULT_ENDPOINT.ZHIPU.chat,
        model: 'glm-4.5-flash',
        apiKeyName: DEFAULT_API_KEY_NAME.ZHIPU,
      },
      {
        provider: '智谱',
        type: 'chat',
        endpoint: DEFAULT_ENDPOINT.ZHIPU.chat,
        model: 'glm-z1-flash',
        apiKeyName: DEFAULT_API_KEY_NAME.ZHIPU,
      },
      {
        provider: '讯飞',
        type: 'chat',
        endpoint: DEFAULT_ENDPOINT.XUNFEI.chat,
        model: 'lite',
        apiKeyName: DEFAULT_API_KEY_NAME.XUNFEI,
      },
      {
        provider: '腾讯',
        type: 'chat',
        endpoint: DEFAULT_ENDPOINT.TENCENT.chat,
        model: 'hunyuan-lite',
        apiKeyName: DEFAULT_API_KEY_NAME.TENCENT,
      },
      {
        provider: '书生',
        type: 'chat',
        endpoint: DEFAULT_ENDPOINT.SHUSHENG.chat,
        model: 'internlm3-8b-instruct',
        apiKeyName: DEFAULT_API_KEY_NAME.SHUSHENG,
      },
      {
        provider: '书生',
        type: 'chat',
        endpoint: DEFAULT_ENDPOINT.SHUSHENG.chat,
        model: 'intern-s1',
        apiKeyName: DEFAULT_API_KEY_NAME.SHUSHENG,
      },
      {
        provider: '书生',
        type: 'chat',
        endpoint: DEFAULT_ENDPOINT.SHUSHENG.chat,
        model: 'intern-s1-mini',
        apiKeyName: DEFAULT_API_KEY_NAME.SHUSHENG,
      },
      {
        provider: '书生',
        type: 'chat',
        endpoint: DEFAULT_ENDPOINT.SHUSHENG.chat,
        model: 'internlm2.5-latest',
        apiKeyName: DEFAULT_API_KEY_NAME.SHUSHENG,
      },
      {
        provider: '智谱',
        type: 'image',
        endpoint: DEFAULT_ENDPOINT.ZHIPU.image,
        model: 'cogview-3-flash',
        apiKeyName: DEFAULT_API_KEY_NAME.ZHIPU,
      },
      {
        provider: '智谱',
        type: 'video',
        endpoint: DEFAULT_ENDPOINT.ZHIPU.video,
        model: 'cogvideox-flash',
        apiKeyName: DEFAULT_API_KEY_NAME.ZHIPU,
      },
    ])

    const customModels = ref([])

    const activeModels = ref({
      chat: {
        case: {
          source: 'default',
          provider: '智谱',
          endpoint: DEFAULT_ENDPOINT.ZHIPU.chat,
          model: 'glm-4-flash-250414',
          apiKeyName: DEFAULT_API_KEY_NAME.ZHIPU,
        },
        story: {
          source: 'default',
          provider: '智谱',
          endpoint: DEFAULT_ENDPOINT.ZHIPU.chat,
          model: 'glm-4-flash-250414',
          apiKeyName: DEFAULT_API_KEY_NAME.ZHIPU,
        },
        test: {
          source: 'default',
          provider: '智谱',
          endpoint: DEFAULT_ENDPOINT.ZHIPU.chat,
          model: 'glm-4-flash-250414',
          apiKeyName: DEFAULT_API_KEY_NAME.ZHIPU,
        },
        act: {
          source: 'default',
          provider: '智谱',
          endpoint: DEFAULT_ENDPOINT.ZHIPU.chat,
          model: 'glm-4-flash-250414',
          apiKeyName: DEFAULT_API_KEY_NAME.ZHIPU,
        },
        rate: {
          source: 'default',
          provider: '智谱',
          endpoint: DEFAULT_ENDPOINT.ZHIPU.chat,
          model: 'glm-4-flash-250414',
          apiKeyName: DEFAULT_API_KEY_NAME.ZHIPU,
        },
        check: {
          source: 'default',
          provider: '智谱',
          endpoint: DEFAULT_ENDPOINT.ZHIPU.chat,
          model: 'glm-4-flash-250414',
          apiKeyName: DEFAULT_API_KEY_NAME.ZHIPU,
        },
        face: {
          source: 'default',
          provider: '智谱',
          endpoint: DEFAULT_ENDPOINT.ZHIPU.chat,
          model: 'glm-4-flash-250414',
          apiKeyName: DEFAULT_API_KEY_NAME.ZHIPU,
        },
        illustration: {
          source: 'default',
          provider: '智谱',
          endpoint: DEFAULT_ENDPOINT.ZHIPU.chat,
          model: 'glm-4-flash-250414',
          apiKeyName: DEFAULT_API_KEY_NAME.ZHIPU,
        },
      },
      image: {
        face: {
          source: 'default',
          provider: '智谱',
          endpoint: DEFAULT_ENDPOINT.ZHIPU.image,
          model: 'cogview-3-flash',
          apiKeyName: DEFAULT_API_KEY_NAME.ZHIPU,
        },
        illustration: {
          source: 'default',
          provider: '智谱',
          endpoint: DEFAULT_ENDPOINT.ZHIPU.image,
          model: 'cogview-3-flash',
          apiKeyName: DEFAULT_API_KEY_NAME.ZHIPU,
        },
      },
      video: {
        pose: {
          source: 'default',
          provider: '智谱',
          endpoint: DEFAULT_ENDPOINT.ZHIPU.video,
          model: 'cogvideox-flash',
          apiKeyName: DEFAULT_API_KEY_NAME.ZHIPU,
        },
      },
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

    return {
      DEFAULT_PROVIDER_ID,
      DEFAULT_ENDPOINT,
      defaultModels,
      customModels,
      activeModels,
      database,
    }
  },
  {
    persist: {
      pick: ['customModels', 'activeModels'],
    },
  }
)
