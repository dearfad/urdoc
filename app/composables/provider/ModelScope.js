export const useProviderModelScope = () => {
  const FREE_API_KEY_NAME = 'ZHIPU_API_KEY'
  const USER_API_KEY_NAME = 'USER_MODELSCOPE_API_KEY'
  const API_BASE = 'https://api-inference.modelscope.cn/v1'
  const CHAT_COMPLETIONS = '/chat/completions'
  const IMAGES_GENERATIONS = '/images/generations'

  const stateStore = useStateStore()
  const modelStore = useModelStore()
  const apiKeyStore = useApiKeyStore()

  async function getResponse(modelType, modelUsage, messages) {
    if (modelType === 'chat') return await getChatResponse(modelUsage, messages)
    if (modelType === 'image') return await getImageResponse(modelUsage, messages)
    stateStore.appInfos.push('Model Type NOT Supported')
    return
  }

  async function getStreamContent(modelUsage, response) {
    const { parse } = await import('partial-json')
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
          modelResponseStream.content += choice.delta.content ? choice.delta.content : ''
          modelResponseStream.reasoning_content += choice.delta.reasoning_content
            ? choice.delta.reasoning_content
            : ''
          if (modelUsage === 'case') {
            modelStore.modelResponse.chat.reasoning_content = modelResponseStream.reasoning_content
              ? modelResponseStream.reasoning_content
              : ''
            modelStore.modelResponse.chat.content = modelResponseStream.content.trim()
              ? parse(modelResponseStream.content)
              : ''
          } else {
            modelStore.modelResponse.chat.reasoning_content = modelResponseStream.reasoning_content
            modelStore.modelResponse.chat.content = modelResponseStream.content
          }
        } catch (error) {
          console.log('error: ', error.message)
          continue
        }
      }
    }

    return modelStore.modelResponse
  }

  async function getChatResponse(modelUsage, messages) {
    modelStore.modelResponse.chat.content = ''
    modelStore.modelResponse.chat.reasoning_content = ''
    const chatModel = modelStore.activeModels.chat[modelUsage]
    const payload = {
      url: `${API_BASE}${CHAT_COMPLETIONS}`,
      apiKey: chatModel.source === 'free' ? '' : apiKeyStore.apiKeys[USER_API_KEY_NAME]?.apiKey,
      apiKeyName:
        chatModel.source === 'free'
          ? FREE_API_KEY_NAME
          : apiKeyStore.apiKeys[USER_API_KEY_NAME]?.apiKeyName,
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
    // if (chatModel.thinking) {
    //   payload.body.thinking = {
    //     type: stateStore.isModelThinking ? 'enabled' : 'disabled',
    //   }
    // }

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
  }

  async function getImageResponse(modelUsage, messages) {
    modelStore.modelResponse.image.url = ''
    const imageModel = modelStore.activeModels.image[modelUsage]
    const payload = {
      url: `${API_BASE}${IMAGES_GENERATIONS}`,
      apiKey: imageModel.source === 'free' ? '' : apiKeyStore.apiKeys[USER_API_KEY_NAME]?.apiKey,
      apiKeyName:
        imageModel.source === 'free'
          ? FREE_API_KEY_NAME
          : apiKeyStore.apiKeys[USER_API_KEY_NAME]?.apiKeyName,
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
    const task = await response.json()
    const taskId = task.task_id
    const taskUrl = `${API_BASE}/tasks/${taskId}`
    while (true) {
      const result = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: taskUrl,
          apiKey:
            imageModel.source === 'free' ? '' : apiKeyStore.apiKeys[USER_API_KEY_NAME]?.apiKey,
          apiKeyName:
            imageModel.source === 'free'
              ? FREE_API_KEY_NAME
              : apiKeyStore.apiKeys[USER_API_KEY_NAME]?.apiKeyName,
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-ModelScope-Task-Type': 'image_generation',
          },
        }),
      })
      const data = await result.json()
      if (data['task_status'] === 'SUCCEED') {
        modelStore.modelResponse.image.url = data['output_images'][0]
        break
      }
      if (data['task_status'] == 'FAILED') {
        console.log('Image Generation Failed.')
        break
      }
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }
    return modelStore.modelResponse.image.url
  }

  return {
    getResponse,
  }
}
