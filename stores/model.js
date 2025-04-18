export const useModelStore = defineStore('model', () => {
  const models = ref({
    chat: {
      gateways: [
        {
          name: '直连',
          id: '直连',
          url: '',
          key: '',
          providers: [
            {
              // BigModel 智谱AI大模型开放平台 https://bigmodel.cn
              name: '智谱',
              id: '智谱',
              url: 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
              key: 'ZHIPU_API_KEY',
              models: [
                {
                  name: 'GLM-4-Flash-250414',
                  id: 'glm-4-flash-250414',
                },
                {
                  name: 'GLM-Z1-Flash',
                  id: 'glm-z1-flash',
                },
                {
                  name: 'GLM-4-Flash',
                  id: 'glm-4-flash',
                },
              ],
            },
            {
              // 百度千帆大模型平台 https://cloud.baidu.com/product-s/qianfan_home
              name: '百度千帆',
              id: '百度千帆',
              url: 'https://qianfan.baidubce.com/v2/chat/completions',
              key: 'QIANFAN_API_KEY',
              models: [
                { name: 'ERNIE-Lite-8K', id: 'ernie-lite-8k' },
                { name: 'ERNIE-Tiny-8K', id: 'ernie-tiny-8k' },
                {
                  name: 'Llama-4-Maverick-17B-128E-Instruct',
                  id: 'llama-4-maverick-17b-128e-instruct',
                },
                { name: 'Llama-4-Scout-17B-16E-Instruct', id: 'llama-4-scout-17b-16e-instruct' },
                { name: 'ERNIE-Speed-8K', id: 'ernie-speed-8k' },
                { name: 'ERNIE-Speed-128K', id: 'ernie-speed-128k' },
              ],
            },
            // 讯飞开放平台 星火大模型 https://www.xfyun.cn/
            {
              name: '讯飞',
              id: '讯飞',
              url: 'https://spark-api-open.xf-yun.com/v1/chat/completions',
              key: 'XFYUN_API_KEY',
              models: [{ name: '星火 Spark Lite', id: 'lite' }],
            },

            // 火山方舟 豆包大模型 https://www.volcengine.com/product/ark
            // 剩362,270/共50万tokens
            {
              name: '火山方舟',
              id: '火山方舟',
              url: 'https://ark.cn-beijing.volces.com/api/v3/chat/completions',
              key: 'DOUBAO_API_KEY',
              models: [
                { name: '豆包 Doubao-lite-4k|character-240828', id: 'ep-20241223143555-ms9k5' },
              ],
            },

            // 阿里云百炼 通义大模型 https://www.aliyun.com/product/bailian
            {
              name: '阿里云百炼',
              id: '阿里云百炼',
              url: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
              key: 'ALIYUN_API_KEY',
              models: [
                { name: '通义千问-Plus-2025-01-25', id: 'qwen-plus-2025-01-25' },
                { name: 'DeepSeek-V3', id: 'deepseek-v3' },
              ],
            },

            // 腾讯云 混元大模型 https://cloud.tencent.com/product/hunyuan
            {
              name: '腾讯混元大模型',
              id: '腾讯混元大模型',
              url: 'https://api.hunyuan.cloud.tencent.com/v1/chat/completions',
              key: 'HUNYUAN_API_KEY',
              models: [{ name: 'hunyuan-lite', id: 'hunyuan-lite' }],
            },
          ],
        },
        {
          name: 'EdgeOne',
          id: 'EdgeOne',
          url: 'https://ai-gateway.eo-edgefunctions7.com',
          key: 'EDGEONE_AIGATEWAY_KEY',
          providers: [
            {
              name: '阿里AI',
              id: '阿里AI',
              url: '',
              key: 'ALIYUN_API_KEY',
              models: [
                { name: '通义千问-Plus-2025-01-25', id: 'qwen-plus-2025-01-25' },
                { name: 'DeepSeek-V3', id: 'deepseek-v3' },
              ],
            },
          ],
        },
        {
          name: 'OpenRouter',
          id: 'OpenRouter',
          url: 'https://openrouter.ai/api/v1/chat/completions',
          key: 'OPENROUTER_API_KEY',
          providers: [
            {
              name: 'DeepSeek',
              id: 'DeepSeek',
              url: '',
              key: '',
              models: [
                {
                  name: 'DeepSeek: DeepSeek V3 0324 (free)',
                  id: 'deepseek/deepseek-chat-v3-0324:free',
                },
              ],
            },
            {
              name: 'Moonshot',
              id: 'Moonshot',
              url: '',
              key: '',
              models: [
                {
                  name: 'Moonshot AI: Moonlight 16B A3B Instruct (free)',
                  id: 'moonshotai/moonlight-16b-a3b-instruct:free',
                },
              ],
            },
            {
              name: 'Google',
              id: 'Google',
              url: '',
              key: '',
              models: [
                {
                  name: 'Google: Gemma 3 12B (free)',
                  id: 'google/gemma-3-12b-it:free',
                },
              ],
            },
            {
              name: 'Mistral',
              id: 'Mistral',
              url: '',
              key: '',
              models: [
                {
                  name: 'Mistral: Mistral Small 3.1 24B (free)',
                  id: 'mistralai/mistral-small-3.1-24b-instruct:free',
                },
              ],
            },
          ],
        },
      ],
    },
    images: {
      gateways: [
        {
          name: '直连',
          id: '直连',
          url: '',
          key: '',
          providers: [
            {
              name: '智谱',
              id: '智谱',
              url: 'https://open.bigmodel.cn/api/paas/v4/images/generations',
              key: 'ZHIPU_API_KEY',
              models: [{ name: 'CogView-3-Flash', id: 'cogview-3-flash' }],
            },
          ],
        },
      ],
    },
    videos: {
      gateways: [
        {
          name: '直连',
          id: '直连',
          url: '',
          key: '',
          providers: [
            {
              name: '智谱',
              id: '智谱',
              url: 'https://open.bigmodel.cn/api/paas/v4/videos/generations',
              resultUrl: 'https://open.bigmodel.cn/api/paas/v4/async-result/',
              key: 'ZHIPU_API_KEY',
              models: [{ name: 'CogVideoX-Flash', id: 'cogvideox-flash' }],
            },
          ],
        },
      ],
    },
  })

  return { models }
})
