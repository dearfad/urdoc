export const useModelStore = defineStore(
  'model',
  () => {
    // const tempDefaultModels = ref({
    //   chat: {
    //     gateways: [
    //       {
    //         name: '直连',
    //         id: '直连',
    //         url: '',
    //         key: '',
    //         providers: [
    //           // BigModel 智谱AI大模型开放平台 https://bigmodel.cn
    //           {
    //             name: '智谱',
    //             id: '智谱',
    //             url: 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
    //             key: 'ZHIPU_API_KEY',
    //             models: [
    //               {
    //                 name: 'GLM-4-Flash-250414',
    //                 id: 'glm-4-flash-250414',
    //               },
    //               {
    //                 name: 'GLM-4-Flash',
    //                 id: 'glm-4-flash',
    //               },
    //               {
    //                 name: 'GLM-4.5-Flash',
    //                 id: 'glm-4.5-flash',
    //               },
    //               {
    //                 name: 'GLM-Z1-Flash',
    //                 id: 'glm-z1-flash',
    //               },
    //             ],
    //           },
    //           // 讯飞开放平台 星火大模型 https://www.xfyun.cn/
    //           {
    //             name: '讯飞',
    //             id: '讯飞',
    //             url: 'https://spark-api-open.xf-yun.com/v1/chat/completions',
    //             key: 'XFYUN_API_KEY',
    //             models: [{ name: '星火 Spark Lite', id: 'lite' }],
    //           },
    //           // 腾讯云 混元大模型 https://cloud.tencent.com/product/hunyuan
    //           {
    //             name: '腾讯混元',
    //             id: '腾讯混元',
    //             url: 'https://api.hunyuan.cloud.tencent.com/v1/chat/completions',
    //             key: 'HUNYUAN_API_KEY',
    //             models: [{ name: 'hunyuan-lite', id: 'hunyuan-lite' }],
    //           },
    //           // 书生 书生·浦语 https://internlm.intern-ai.org.cn/
    //           // 输入：9百万/月，输出：3百万/月
    //           {
    //             name: '书生·浦语',
    //             id: '书生·浦语',
    //             url: 'https://chat.intern-ai.org.cn/api/v1/chat/completions',
    //             key: 'SHUSHENG_API_KEY',
    //             models: [
    //               { name: 'Intern-latest', id: 'intern-latest' },
    //               { name: 'InternLM3-latest', id: 'internlm3-latest' },
    //               { name: 'InternLM2.5-latest', id: 'internlm2.5-latest' },
    //               { name: 'InternVL3-latest', id: 'internvl3-latest' },
    //             ],
    //           },
    //         ],
    //         // 百度千帆大模型平台 https://cloud.baidu.com/product-s/qianfan_home
    //         // 效果太差，免费，待后续版本完善
    //         // {
    //         //   name: '百度千帆',
    //         //   id: '百度千帆',
    //         //   url: 'https://qianfan.baidubce.com/v2/chat/completions',
    //         //   key: 'QIANFAN_API_KEY',
    //         //   models: [
    //         //     { name: 'ERNIE-Tiny-8K', id: 'ernie-tiny-8k' },
    //         //     { name: 'ERNIE-Lite-8K', id: 'ernie-lite-8k' },
    //         //     { name: 'ERNIE-Speed-8K', id: 'ernie-speed-8k' },
    //         //     { name: 'ERNIE-Speed-128K', id: 'ernie-speed-128k' },
    //         //   ],
    //         // },

    //         // 火山方舟 豆包大模型 https://www.volcengine.com/product/ark
    //         // 剩362,270/共50万tokens，其他模型免费50万tokens
    //         // {
    //         //   name: '火山方舟',
    //         //   id: '火山方舟',
    //         //   url: 'https://ark.cn-beijing.volces.com/api/v3/chat/completions',
    //         //   key: 'DOUBAO_API_KEY',
    //         //   models: [
    //         //     { name: '豆包 Doubao-lite-4k|character-240828', id: 'ep-20241223143555-ms9k5' },
    //         //   ],
    //         // },

    //         // 阿里云百炼 通义大模型 https://www.aliyun.com/product/bailian
    //         // 模型100万Tokens，到期时间：2025-10-26
    //         // {
    //         //   name: '阿里云百炼',
    //         //   id: '阿里云百炼',
    //         //   url: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
    //         //   key: 'ALIYUN_API_KEY',
    //         //   models: [
    //         //     { name: '通义千问-Plus-2025-04-28', id: 'qwen-plus-2025-04-28' },
    //         //     // { name: 'Moonshot-Kimi-K2-Instruct', id: 'Moonshot-Kimi-K2-Instruct' },
    //         //   ],
    //         // },
    //       },
    //       // {
    //       //   name: 'EdgeOne(Beta)',
    //       //   id: 'EdgeOne',
    //       //   url: 'https://ai-gateway.eo-edgefunctions7.com',
    //       //   key: 'EDGEONE_AIGATEWAY_KEY',
    //       //   providers: [
    //       //     {
    //       //       name: '阿里AI',
    //       //       id: '阿里AI',
    //       //       url: '',
    //       //       key: 'ALIYUN_API_KEY',
    //       //       models: [{ name: '通义千问-Plus-2025-04-28', id: 'qwen-plus-2025-04-28' }],
    //       //     },
    //       //   ],
    //       // },
    //       // ===========================================================
    //       {
    //         name: 'OpenRouter',
    //         id: 'OpenRouter',
    //         url: 'https://openrouter.ai/api/v1/chat/completions',
    //         key: 'OPENROUTER_API_KEY',
    //         providers: [
    //           {
    //             name: 'Qwen',
    //             id: 'Qwen',
    //             url: '',
    //             key: '',
    //             models: [
    //               {
    //                 name: 'Qwen: Qwen3 30B A3B (free)',
    //                 id: 'qwen/qwen3-30b-a3b:free',
    //               },
    //             ],
    //           },
    //           {
    //             name: 'DeepSeek',
    //             id: 'DeepSeek',
    //             url: '',
    //             key: '',
    //             models: [
    //               {
    //                 name: 'DeepSeek: DeepSeek V3 0324 (free)',
    //                 id: 'deepseek/deepseek-chat-v3-0324:free',
    //               },
    //             ],
    //           },
    //           {
    //             name: 'Moonshot',
    //             id: 'Moonshot',
    //             url: '',
    //             key: '',
    //             models: [
    //               {
    //                 name: 'Moonshot AI: Kimi K2 (free)',
    //                 id: 'moonshotai/kimi-k2:free',
    //               },
    //               {
    //                 name: 'Moonshot AI: Moonlight 16B A3B Instruct (free)',
    //                 id: 'moonshotai/moonlight-16b-a3b-instruct:free',
    //               },
    //             ],
    //           },
    //           {
    //             name: 'Google',
    //             id: 'Google',
    //             url: '',
    //             key: '',
    //             models: [
    //               {
    //                 name: 'Google: Gemma 3 12B (free)',
    //                 id: 'google/gemma-3-12b-it:free',
    //               },
    //             ],
    //           },
    //           {
    //             name: 'Mistral',
    //             id: 'Mistral',
    //             url: '',
    //             key: '',
    //             models: [
    //               {
    //                 name: 'Mistral: Mistral Small 3.1 24B (free)',
    //                 id: 'mistralai/mistral-small-3.1-24b-instruct:free',
    //               },
    //             ],
    //           },
    //           {
    //             name: 'THUDM',
    //             id: 'THUDM',
    //             url: '',
    //             key: '',
    //             models: [
    //               {
    //                 name: 'THUDM: GLM 4 32B (free)',
    //                 id: 'thudm/glm-4-32b:free',
    //               },
    //             ],
    //           },
    //           {
    //             name: 'NVIDIA',
    //             id: 'NVIDIA',
    //             url: '',
    //             key: '',
    //             models: [
    //               {
    //                 name: 'NVIDIA: Llama 3.1 Nemotron Ultra 253B v1 (free)',
    //                 id: 'nvidia/llama-3.1-nemotron-ultra-253b-v1:free',
    //               },
    //             ],
    //           },
    //         ],
    //       },
    //       // ===========================================================
    //       // {
    //       //   name: 'Pollinations',
    //       //   id: 'Pollinations',
    //       //   url: 'https://text.pollinations.ai/openai',
    //       //   key: 'POLLINATIONS_API_KEY',
    //       //   providers: [
    //       //     {
    //       //       name: 'OpenAI',
    //       //       id: 'OpenAI',
    //       //       url: '',
    //       //       key: '',
    //       //       models: [
    //       //         {
    //       //           name: 'OpenAI GPT-4o Mini',
    //       //           id: 'openai',
    //       //         },
    //       //       ],
    //       //     },
    //       //   ],
    //       // },
    //       // {
    //       //   name: 'ModelScope',
    //       //   id: 'ModelScope',
    //       //   url: 'https://api-inference.modelscope.cn/v1/chat/completions',
    //       //   key: 'MODELSCOPE_API_KEY',
    //       //   providers: [
    //       //     {
    //       //       name: '通义千问',
    //       //       id: '通义千问',
    //       //       url: '',
    //       //       key: '',
    //       //       models: [
    //       //         { name: '通义千问 QwQ-32B', id: 'Qwen/QwQ-32B' },
    //       //         { name: '通义千问3-0.6B', id: 'Qwen/Qwen3-0.6B' },
    //       //       ],
    //       //     },
    //       //   ],
    //       // },
    //     ],
    //   },
    //   image: {
    //     gateways: [
    //       {
    //         name: '直连',
    //         id: '直连',
    //         url: '',
    //         key: '',
    //         providers: [
    //           {
    //             name: '智谱',
    //             id: '智谱',
    //             url: 'https://open.bigmodel.cn/api/paas/v4/images/generations',
    //             key: 'ZHIPU_API_KEY',
    //             models: [{ name: 'CogView-3-Flash', id: 'cogview-3-flash' }],
    //           },
    //         ],
    //       },
    //     ],
    //   },
    //   video: {
    //     gateways: [
    //       {
    //         name: '直连',
    //         id: '直连',
    //         url: '',
    //         key: '',
    //         providers: [
    //           {
    //             name: '智谱',
    //             id: '智谱',
    //             url: 'https://open.bigmodel.cn/api/paas/v4/videos/generations',
    //             resultUrl: 'https://open.bigmodel.cn/api/paas/v4/async-result/',
    //             key: 'ZHIPU_API_KEY',
    //             models: [{ name: 'CogVideoX-Flash', id: 'cogvideox-flash' }],
    //           },
    //         ],
    //       },
    //     ],
    //   },
    // })

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
        model: 'intern-latest',
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
      // async selectAll() {
      //   const { data, error } = await supabase.getData('prompts').selectAll()
      //   !error &&
      //     promptType.forEach((item) => {
      //       prompts.value.user[item] = data.filter((i) => i.type === item)
      //     })
      //   // stateStore.appInfos.push(!error ? '刷新成功' : '刷新失败')
      // },
      // async selectByColumn(column, value) {
      //   const { data, error } = await supabase.getData('prompts').selectByColumn(column, value)
      //   !error && (prompts.value.user[value] = data)
      //   // stateStore.appInfos.push(!error ? '刷新成功' : '刷新失败')
      // },
      // async select(promptData) {
      //   const { data, error } = await supabase.getData('prompts').select(promptData)
      //   return error ? undefined : data[0]
      // },
      // async insert(promptData) {
      //   const { data, error } = await supabase.getData('prompts').insert(promptData)
      //   stateStore.appInfos.push(!error && data.length > 0 ? '添加成功' : '添加失败')
      //   return error ? undefined : data[0]
      // },
      // async update(promptData) {
      //   const { data, error } = await supabase.getData('prompts').update(promptData)
      //   stateStore.appInfos.push(!error && data.length > 0 ? '更新成功' : '更新失败')
      //   return error ? undefined : data[0]
      // },
      // async remove(promptData) {
      //   const { data, error } = await supabase.getData('prompts').remove(promptData)
      //   stateStore.appInfos.push(!error && data.length > 0 ? '删除成功' : '删除失败')
      //   return error ? undefined : data[0]
      // },
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
