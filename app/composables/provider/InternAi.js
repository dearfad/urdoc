// Website: https://internlm.intern-ai.org.cn
// docs: https://internlm.intern-ai.org.cn/api/document
export const useProviderInternAi = () => {
  const FREE_API_KEY_NAME = 'SHUSHENG_API_KEY'
  const USER_API_KEY_NAME = 'USER_SHUSHENG_API_KEY'
  const API_BASE = 'https://chat.intern-ai.org.cn/api/v1'
  const CHAT_COMPLETIONS = '/chat/completions'

  const stateStore = useStateStore()
  const modelStore = useModelStore()
  const apiKeyStore = useApiKeyStore()

  async function getResponse(modelType, modelUsage, messages) {
    if (modelType === 'chat') return await getChatResponse(modelUsage, messages)
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

            if (modelResponseStream.content.split('```json').length > 1) {
              modelStore.modelResponse.chat.content = modelResponseStream.content
                .split('```json')[1]
                .trim()
                ? parse(modelResponseStream.content.split('```json')[1].trim())
                : ''
            } else {
              modelStore.modelResponse.chat.content = modelResponseStream.content.trim()
                ? parse(modelResponseStream.content.trim())
                : ''
            }
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
        response_format: modelUsage === 'case' ? { type: 'json_object' } : { type: 'text' },
      },
    }

    if (chatModel.thinking) {
      payload.body.thinking_mode = stateStore.isModelThinking
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

  return {
    getResponse,
  }
}
