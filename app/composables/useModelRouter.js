export default function () {
  const stateStore = useStateStore()
  const recordStore = useRecordStore()
  const chatModel = useChatModel()
  const imageModel = useImageModel()
  const videoModel = useVideoModel()
  const promptStore = usePromptStore()

  function getChatModelParams(modelUsage, messages, response_format) {
    const model = stateStore.models.chat[modelUsage]
    const params = {
      // 使用模型接入点url
      url: model.url,
      // 默认POST方法
      method: 'POST',
      // 添加apiKeyName，优先网关gateway，次选服务商provider
      apiKeyName: model.key.gateway || model.key.provider,
      // 服务器端根据apiKeyName添加
      // Authorization: 'Bearer <apiKey>',
      headers: {
        'Content-Type': 'application/json',
      },
      // 请求体 response_format 有区别，待规范化
      body: JSON.stringify({
        model: model.id,
        messages: messages,
        stream: true,
        response_format: response_format === 'text' ? { type: 'text' } : { type: 'json_object' },
      }),
    }
    return params
  }

  function getImageModelParams(modelUsage, prompt) {
    const model = stateStore.models.image[modelUsage]
    const params = {
      url: model.url,
      method: 'POST',
      apiKeyName: model.key.gateway || model.key.provider,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model.id,
        prompt: prompt,
      }),
    }
    return params
  }

  function getVideoModelParams(modelUsage, prompt) {
    const model = stateStore.models.video[modelUsage]
    const params = {
      url: model.url,
      method: 'POST',
      apiKeyName: model.key.gateway || model.key.provider,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model.id,
        prompt: prompt,
        image_url: recordStore.record.face,
      }),
    }
    return params
  }

  // Chat Model

  async function getCase(messages) {
    const params = getChatModelParams('case', messages, 'json')
    return await chatModel.getResponse(params, 'json', recordStore.watchFields.case)
  }
  async function checkCase(messages) {
    const params = getChatModelParams('check', messages, 'json')
    return await chatModel.getResponse(params, 'json', recordStore.watchFields.case)
  }

  async function getStory(messages) {
    const params = getChatModelParams('story', messages, 'text')
    return await chatModel.getResponse(params, 'text')
  }

  async function getTest(messages) {
    const params = getChatModelParams('test', messages, 'json')
    return await chatModel.getResponse(params, 'json')
  }

  async function getAct(messages) {
    const params = getChatModelParams('act', messages, 'text')
    return await chatModel.getResponse(params, 'text')
  }

  async function getRate(messages) {
    const params = getChatModelParams('rate', messages, 'text')
    return await chatModel.getResponse(params, 'text')
  }

  // Image Model

  async function getFace(messages) {
    const chatParams = getChatModelParams('face', messages, 'text')
    const prompt = await chatModel.getResponse(chatParams, 'text')
    promptStore.prompts.image.face = prompt
    const imageParams = getImageModelParams('face', prompt)
    return await imageModel.getResponse(imageParams)
  }

  // Video Model

  async function getPose(messages) {
    const chatParams = getChatModelParams('pose', messages, 'text')
    const prompt = await chatModel.getResponse(chatParams, 'text')
    promptStore.prompts.video.pose = prompt
    const videoParams = getVideoModelParams('pose', prompt)
    stateStore.poseId = await videoModel.getResponse(videoParams)
    stateStore.appInfo = stateStore.poseId
  }

  // Voice Model
  async function getVoice(text) {
    const response = await $fetch(
      `https://textreadtts.com/tts/convert?accessKey=FREE&language=chinese&speaker=speaker${stateStore.voiceId}&text=${text}`
    )
    return response.audio
  }

  return { getCase, getStory, getTest, getAct, getRate, getFace, getPose, getVoice, checkCase }
}
