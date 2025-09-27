// Website: https://bigmodel.cn
// Docs: https://docs.bigmodel.cn
export const useProviderBigModel = () => {
  const FREE_API_KEY_NAME = 'ZHIPU_API_KEY'
  const USER_API_KEY_NAME = 'USER_BIGMODEL_API_KEY'
  const API_BASE = 'https://open.bigmodel.cn/api/paas/v4'
  const CHAT_COMPLETIONS = '/chat/completions'
  const IMAGES_GENERATIONS = '/images/generations'
  const VIDEOS_GENERATIONS = '/videos/generations'
  const ASYNC_RESULT = '/async-result'

  const stateStore = useStateStore()
  const modelStore = useModelStore()
  const apiKeyStore = useApiKeyStore()
  const recordStore = useRecordStore()

  async function getResponse(modelType, modelUsage, messages) {
    if (modelType === 'chat') return await getChatResponse(modelUsage, messages)
    if (modelType === 'image') return await getImageResponse(modelUsage, messages)
    if (modelType === 'video') return await getVideoResponse(modelUsage, messages)
    stateStore.appInfos.push('Model Type NOT Supported')
    return
  }

  async function getStreamContent(modelUsage, response) {
    const { parse } = await import('partial-json')
    modelStore.modelResponse.chat.content = ''
    modelStore.modelResponse.chat.reasoning_content = ''
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
    const chatModel = modelStore.activeModels.chat[modelUsage]
    const payload = {
      url: `${API_BASE}${CHAT_COMPLETIONS}`,
      apiKey: chatModel.source === 'free' ? '' : apiKeyStore.apiKeys[USER_API_KEY_NAME],
      apiKeyName: chatModel.source === 'free' ? FREE_API_KEY_NAME : '',
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
    if (chatModel.thinking) {
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
  }

  async function getImageResponse(modelUsage, messages) {
    modelStore.modelResponse.image.url = ''
    const imageModel = modelStore.activeModels.image[modelUsage]
    const payload = {
      url: `${API_BASE}${IMAGES_GENERATIONS}`,
      apiKey: apiKeyStore.apiKeys[imageModel.apiKeyName] || '',
      apiKeyName: imageModel.apiKeyName || '',
      headers: {
        'Content-Type': 'application/json',
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
    const content = await response.json()
    modelStore.modelResponse.image.url = content.data[0].url || ''
    return modelStore.modelResponse.image.url
  }

  async function getVideoResponse(modelUsage, messages) {
    modelStore.modelResponse.video.url = ''
    const videoModel = modelStore.activeModels.video[modelUsage]
    const payload = {
      url: `${API_BASE}${VIDEOS_GENERATIONS}`,
      apiKey: apiKeyStore.apiKeys[videoModel.apiKeyName] || '',
      apiKeyName: videoModel.apiKeyName || '',
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: {
        model: videoModel.model,
        prompt: messages,
        image_url: recordStore.record.face,
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
    const content = await response.json()
    const taskId = content.id || ''
    if (!taskId) {
      stateStore.appInfos.push(content.error.message)
      return
    }
    const taskUrl = `${API_BASE}${ASYNC_RESULT}/${taskId}`
    while (true) {
      const result = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: taskUrl,
          apiKey: apiKeyStore.apiKeys[videoModel.apiKeyName] || '',
          apiKeyName: videoModel.apiKeyName || '',
          method: 'GET',
          headers: {},
        }),
      })
      const data = await result.json()

      if (data['task_status'] === 'SUCCESS') {
        modelStore.modelResponse.video.url = data.video_result[0].url
        modelStore.modelResponse.video.cover_image_url = data.video_result[0].cover_image_url
        break
      }

      if (data['task_status'] === 'FAIL') {
        console.log('Image Generation Failed.')
        break
      }

      if (data['error']) {
        stateStore.appInfos.push(data.error.message)
        break
      }

      await new Promise((resolve) => setTimeout(resolve, 5000))
    }
    return modelStore.modelResponse.video
  }

  return {
    getResponse,
  }
}
