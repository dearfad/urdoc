import { jsonrepair } from 'jsonrepair'
export default function () {
  const API_BASE = 'https://ai.gitee.com/v1'
  const CHAT_COMPLETIONS = '/chat/completions'
  const FREE_MODELS = ['DeepSeek-R1', 'Qwen3-Next-80B-A3B-Thinking']
  const THINKING_MODELS = []

  const stateStore = useStateStore()
  const modelStore = useModelStore()
  const apiKeyStore = useApiKeyStore()

  function validateFreeModel(payload) {
    // 如果提供了API密钥或API密钥名称，则可以使用任意模型
    if (payload.apiKey || payload.apiKeyName) {
      return true
    }
    // 否则检查模型是否在免费列表中
    return FREE_MODELS.includes(payload.model)
  }

  async function getResponse(modelType, modelUsage, messages) {
    stateStore.modelResponseString = {
      content: '',
      reasoning_content: '',
    }

    if (modelType === 'chat') return await getChatResponse(modelUsage, messages)

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
        // response_format: modelUsage === 'case' ? { type: 'json_object' } : { type: 'text' },
      },
    }

    if (!validateFreeModel(payload)) return

    if (THINKING_MODELS.includes(chatModel.model)) {
      payload.body.thinking = {
        type: stateStore.isModelThinking ? 'enabled' : 'disabled',
      }
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
    await getContent(response)
    return
  }

  async function getContent(response) {
    const stateStore = useStateStore()
    const reader = response.body.getReader()
    const decoder = new TextDecoder('utf-8')
    let buffer = ''
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n\n')
      buffer = lines.pop() || ''
      let data = ''
      for (const line of lines) {
        if (line.startsWith('data: [DONE]')) break
        if (line.startsWith('data: ')) {
          data = line.slice(6)
        } else {
          continue
        }
        try {
          const message = JSON.parse(data)
          const choice = message.choices[0]
          stateStore.modelResponseString.content += choice.delta.content || ''
          stateStore.modelResponseString.reasoning_content += choice.delta.reasoning_content || ''
        } catch (error) {
          console.log('error: ', error.message)
          continue
        }
      }
    }
    if (stateStore.modelResponseString.content) {
      stateStore.modelResponseString.content = jsonrepair(stateStore.modelResponseString.content)
    }

    return stateStore.modelResponseString
  }

  return {
    getResponse,
  }
}
