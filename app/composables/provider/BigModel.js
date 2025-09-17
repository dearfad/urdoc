import { jsonrepair } from 'jsonrepair'
import { parse } from 'partial-json'
export const useProviderBigModel = () => {
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
  const THINKING_MODELS = ['glm-4.5-flash']

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
    modelStore.modelResponse.content = ''
    modelStore.modelResponse.reasoning_content = ''
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
        response_format: modelUsage === 'case' ? { type: 'json_object' } : { type: 'text' },
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
    await getContent(modelUsage, response)
    return
  }

  async function getContent(modelUsage, response) {
    const modelResponseStream = {
      content: '',
      reasoning_content: '',
    }
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
          modelResponseStream.content += choice.delta.content || ''
          modelResponseStream.reasoning_content += choice.delta.reasoning_content || ''
          if (modelUsage === 'case') {
            if (modelResponseStream.content) {
              modelStore.modelResponse.content = parse(modelResponseStream.content)
            }
            modelStore.modelResponse.reasoning_content = modelResponseStream.reasoning_content
          }
        } catch (error) {
          console.log('error: ', error.message)
          continue
        }
      }
    }

    // if (stateStore.modelResponseString.content) {
    //   stateStore.modelResponseString.content = jsonrepair(stateStore.modelResponseString.content)
    // }

    return modelStore.modelResponse
  }

  return {
    getResponse,
  }
}
