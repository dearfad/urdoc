export default function () {
  const modelUtils = useModelUtils()
  const { NO_FREE_MODEL_ERROR } = useErrorConstants
  const API_BASE = 'https://open.bigmodel.cn/api'
  const CHAT_COMPLETIONS = '/paas/v4/chat/completions'
  const FREE_MODELS = [
    'glm-4.5-flash',
    'glm-4.1v-thinking-flash',
    'glm-4-flash-250414',
    'glm-4v-flash',
    'glm-z1-flash',
    'cogview-3-flash',
    'cogvideox-flash',
  ]

  const stateStore = useStateStore()
  const modelStore = useModelStore()
  const apiKeyStore = useApiKeyStore()

  // function validateFreeModel(payload) {
  //   // 如果提供了API密钥或API密钥名称，则可以使用任意模型
  //   if (payload.apiKey || payload.apiKeyName) {
  //     return true
  //   }
  //   // 否则检查模型是否在免费列表中
  //   return FREE_MODELS.includes(payload.model)
  // }

  async function getResponse(modelType, modelUsage, messages) {
    stateStore.modelResponseString = {
      content: '',
      reasoning_content: '',
    }
    if (modelType === 'chat') return await getChatResponse(modelUsage, messages)

    // if (!validateFreeModel(payload)) return sendErrorResponse(NO_FREE_MODEL_ERROR)
    stateStore.appInfos.push('Model Type NOT Supported')
    return
  }

  async function getChatResponse(modelUsage, messages) {
    const chatModel = modelStore.activeModels.chat[modelUsage]
    const payload = {
      url: `${API_BASE}${CHAT_COMPLETIONS}`,
      apiKey: apiKeyStore.apiKeys[chatModel.apiKeyName] || '',
      apiKeyName: chatModel.apiKeyName || '',
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: {
        model: chatModel.model,
        messages: messages,
        stream: true,
        response_format: modelUsage === 'case' ? { type: 'json_object' } : { type: 'text' },
      },
    }
    const url = `${stateStore.apiBaseUrl}/model/proxy`
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (response.status !== 200) {
      const errorFromModel = await response.json()
      stateStore.appInfos.push(errorFromModel.error.message)
      return
    }
    await modelUtils.getContent(response)
    return
  }

  return {
    getResponse,
  }
}
