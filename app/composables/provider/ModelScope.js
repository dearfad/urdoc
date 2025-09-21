import { parse } from 'partial-json'
export const useProviderModelScope = () => {
  const API_BASE = 'https://api-inference.modelscope.cn/v1'
  const CHAT_COMPLETIONS = '/chat/completions'
  const IMAGES_GENERATIONS = '/images/generations'
  const FREE_MODELS = ['deepseek-ai/DeepSeek-V3.1', 'Qwen/Qwen3-Next-80B-A3B-Instruct']
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
    modelStore.modelResponse.content = ''
    modelStore.modelResponse.reasoning_content = ''
    if (modelType === 'chat') return await getChatResponse(modelUsage, messages)
    if (modelType === 'image') return await getImageResponse(modelUsage, messages)
    stateStore.appInfos.push('Model Type NOT Supported')
    return
  }

  async function getImageResponse(modelUsage, messages) {
    const imageModel = modelStore.activeModels.image[modelUsage]
    const payload = {
      url: `${API_BASE}${IMAGES_GENERATIONS}`,
      apiKey: apiKeyStore.apiKeys[imageModel.apiKeyName] || '',
      apiKeyName: imageModel.apiKeyName || '',
      headers: {
        'Content-Type': 'application/json',
        'X-ModelScope-Async-Mode': 'true',
      },
      method: 'POST',
      body: {
        model: imageModel.model,
        prompt: messages,
        // quality: 'standard',
        // size: '1024x1024',
        // watermark_enabled: true,
      },
    }
    if (!validateFreeModel(payload)) return

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
      stateStore.appInfos.push(errorFromModel.errors.message)
      return
    }
    const task = await response.json()
    console.log('task: ', task)
    const taskId = task.task_id
    const taskUrl = `${API_BASE}/tasks/${taskId}`
    let imageUrl = ''
    while (true) {
      const result = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: taskUrl,
          apiKey: apiKeyStore.apiKeys[imageModel.apiKeyName] || '',
          apiKeyName: imageModel.apiKeyName || '',
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-ModelScope-Task-Type': 'image_generation',
          },
        }),
      })
      const data = await result.json()
      if (data['task_status'] === 'SUCCEED') {
        imageUrl = data['output_images'][0]
        break
      }
      if (data['task_status'] == 'FAILED') {
        console.log('Image Generation Failed.')
        break
      }
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }
    return imageUrl
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
    await getStreamContent(modelUsage, response)
    return
  }

  async function getStreamContent(modelUsage, response) {
    const modelResponseStream = {
      content: '',
      reasoning_content: '',
    }
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
          /// ```json ``` 去除
          modelResponseStream.content = modelResponseStream.content
            .replace(/^```json\n?/, '')
            .replace(/\n?```$/, '')
          if (modelUsage === 'case') {
            if (modelResponseStream.content) {
              modelStore.modelResponse.content = parse(modelResponseStream.content)
            }
            modelStore.modelResponse.reasoning_content = modelResponseStream.reasoning_content
          } else {
            modelStore.modelResponse.content = modelResponseStream.content
            modelStore.modelResponse.reasoning_content = modelResponseStream.reasoning_content
          }
        } catch (error) {
          console.log('error: ', error.message)
          continue
        }
      }
    }
    console.log('modelResponse: ', modelStore.modelResponse)
    return modelStore.modelResponse
  }
  return {
    getResponse,
  }
}
