import { NO_FREE_MODEL_ERROR } from '../useErrorConstants'

export default function () {
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
    if (modelType === 'chat') return await getChatResponse(modelUsage, messages)

    // if (!validateFreeModel(payload)) return sendErrorResponse(NO_FREE_MODEL_ERROR)
    stateStore.appInfos.push('Model Type NOT Supported')
    return
  }

  async function getChatResponse(modelUsage, messages) {
    const chatModel = modelStore.activeModels.chat[modelUsage]
    const payload = {
      headers: {
        'Content-Type': 'application/json',
      },
      url: `${API_BASE}${CHAT_COMPLETIONS}`,
      apiKey: apiKeyStore.apiKeys[chatModel.apiKeyName] || '',
      apiKeyName: chatModel.apiKeyName || '',
      model: chatModel.model,
      messages: messages,
      stream: true,
      response_format: modelUsage === 'case' ? { type: 'json_object' } : { type: 'text' },
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

    return parseStreamResponse(response)
  }

  async function parseStreamResponse(response) {
    const decoder = new TextDecoder('utf-8')
    let buffer = ''
    const reader = response.body.getReader()
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || '' // 最后一行可能不完整，留到下次
      for (const line of lines) {
        // const line = raw.trimEnd()
        // if (!line) continue // 心跳空行
        // onChunk(line) // 7. 业务层消费
        try {
          const message = JSON.parse(line)
          stateStore.modelResponseString.content += message.content || ''
          stateStore.modelResponseString.reasoning_content += message.reasoning_content || ''
        } catch (error) {
          stateStore.appInfos.push('Error parsing JSON: ' + error.message)
        }
      }
      stateStore.modelResponseString.content = stateStore.modelResponseString.content.trim()
      stateStore.modelResponseString.reasoning_content =
        stateStore.modelResponseString.reasoning_content.trim()
    }

    // 8. 处理最后一包
    // if (buffer.trim()) onChunk(buf.trim())
  }

  return {
    getResponse,
  }
}
