export const useProviderGitee = () => {
  const FREE_API_KEY_NAME = ''
  const USER_API_KEY_NAME = 'USER_GITEE_API_KEY'
  const API_BASE = 'https://ai.gitee.com/v1'
  const CHAT_COMPLETIONS = '/chat/completions'
  const ASYNC_AUDIO_SPEECH = '/async/audio/speech'

  const stateStore = useStateStore()
  const modelStore = useModelStore()
  const apiKeyStore = useApiKeyStore()

  async function getResponse(modelType, modelUsage, messages) {
    if (modelType === 'chat') return await getChatResponse(modelUsage, messages)
    if (modelType === 'audio') return await getAudioResponse(modelUsage, messages)

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
    const chatModel =
      modelStore.activeModels.chat[modelUsage] || modelStore.activeModels.chat.default
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

  async function getAudioResponse(modelUsage, messages) {
    modelStore.modelResponse.audio.url = ''
    const audioModel =
      modelStore.activeModels.audio[modelUsage] || modelStore.activeModels.audio.default
    const payload = {
      url: `${API_BASE}${ASYNC_AUDIO_SPEECH}`,
      apiKey: audioModel.source === 'free' ? '' : apiKeyStore.apiKeys[USER_API_KEY_NAME]?.apiKey,
      apiKeyName:
        audioModel.source === 'free'
          ? FREE_API_KEY_NAME
          : apiKeyStore.apiKeys[USER_API_KEY_NAME]?.apiKeyName,
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: {
        model: audioModel.model,
        audio_mode: 'Single',
        prompt_audio_single_url: 'https://gitee.com/cryusxin/test/raw/master/single_reference.wav',
        prompt_text_single:
          '[S1]我意思是说通用计算机是指我们所有人都能用的这种普通计算机的意思啊？[S2]不是，不是。现在通用计算机就，比如说现在买了一台电脑嘛。[S1]嗯。[S2]电脑里面你可以装各种各样的软件，对吧？你可以用来聊微信，你可以用来-[S1]明白，可以做会计用的发票机啊-[S2]对对对对 [S1]...连接各种设备啊什么的。[S2]你只要放不同的软件，[S1]嗯。[S2]它都可以去完成那个软件所定义的相对应的工作。',
        use_normalize: true,
        inputs: replaceDialogueSpeakers(messages),
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
    const content = await response.json()
    const taskId = content.task_id || ''
    if (!taskId) {
      stateStore.appInfos.push(content.error.message)
      return
    }
    const taskUrl = `${API_BASE}/task/${taskId}`

    while (true) {
      const result = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: taskUrl,
          apiKey:
            audioModel.source === 'free' ? '' : apiKeyStore.apiKeys[USER_API_KEY_NAME]?.apiKey,
          apiKeyName:
            audioModel.source === 'free'
              ? FREE_API_KEY_NAME
              : apiKeyStore.apiKeys[USER_API_KEY_NAME]?.apiKeyName,
          method: 'GET',
          headers: {},
          body: { model: audioModel.model },
        }),
      })
      const data = await result.json()

      if (data['status'] === 'success') {
        //   if (result.output?.file_url) {
        modelStore.modelResponse.audio.url = data.output?.file_url
        break
      }

      // if (data['task_status'] === 'FAIL') {
      //   console.log('Image Generation Failed.')
      //   break
      // }

      // if (data['error']) {
      //   stateStore.appInfos.push(data.error.message)
      //   break
      // }

      await new Promise((resolve) => setTimeout(resolve, 5000))
    }
    return modelStore.modelResponse.audio.url
  }
  // genericDialogueReplacer.js
  function replaceDialogueSpeakers(dialogue) {
    // 提取所有不同的说话人
    const speakers = new Set()
    const lines = dialogue.split('\n')

    // 找出所有说话人（冒号前的部分）
    lines.forEach((line) => {
      const colonIndex = line.indexOf('：')
      if (colonIndex !== -1) {
        const speaker = line.substring(0, colonIndex + 1) // 包含冒号
        speakers.add(speaker)
      }
    })

    // 将说话人转换为数组并排序以保证一致性
    const speakerList = Array.from(speakers).sort()

    // 创建替换映射
    const speakerMap = {}
    speakerList.forEach((speaker, index) => {
      speakerMap[speaker] = `[S${index + 1}]: `
    })

    // 执行替换
    let result = dialogue
    speakerList.forEach((speaker) => {
      // const regex = new RegExp(speaker.replace(/[()]/g, '\\$&'), 'g')
      const regex = new RegExp(speaker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')
      result = result.replace(regex, speakerMap[speaker])
    })

    return result
  }

  return {
    getResponse,
  }
}
