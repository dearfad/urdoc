export default function () {
  const stateStore = useStateStore()
  const recordStore = useRecordStore()
  const chatModel = useChatModel()
  const imageModel = useImageModel()
  const videoModel = useVideoModel()
  const promptStore = usePromptStore()

  function getChatModelParams(
    modelUsage: keyof typeof stateStore.models.chat,
    messages: Messages,
    response_format: 'text' | 'json'
  ) {
    const model = stateStore.models.chat[modelUsage]
    const params = {
      url: model.url,
      apiKey: model.key.gateway || model.key.provider,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ',
      },
      body: JSON.stringify({
        model: model.id,
        messages: messages,
        stream: true,
        response_format: response_format === 'text' ? { type: 'text' } : { type: 'json_object' },
      }),
    }
    return params
  }

  function getImageModelParams(modelUsage: keyof typeof stateStore.models.image, prompt: string) {
    const model = stateStore.models.image[modelUsage]
    const params = {
      url: model.url,
      apiKey: model.key.gateway || model.key.provider,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ',
      },
      body: JSON.stringify({
        model: model.id,
        prompt: prompt,
      }),
    }
    return params
  }

  function getVideoModelParams(modelUsage: keyof typeof stateStore.models.video, prompt: string) {
    const model = stateStore.models.video[modelUsage]
    const params = {
      url: model.url,
      apiKey: model.key.gateway || model.key.provider,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ',
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

  async function getCase(messages: Messages) {
    const params = getChatModelParams('case', messages, 'json')
    return await chatModel.getResponse(params, 'json', recordStore.watchFields.case)
  }

  async function getStory(messages: Messages) {
    const params = getChatModelParams('story', messages, 'json')
    return await chatModel.getResponse(params, 'json')
  }

  async function getTest(messages: Messages) {
    const params = getChatModelParams('test', messages, 'json')
    return await chatModel.getResponse(params, 'json')
  }

  async function getAct(messages: Messages) {
    const params = getChatModelParams('act', messages, 'text')
    return await chatModel.getResponse(params, 'text')
  }

  async function getRate(messages: Messages) {
    const params = getChatModelParams('rate', messages, 'text')
    return await chatModel.getResponse(params, 'text')
  }

  // Image Model

  async function getFace(messages: Messages) {
    const chatParams = getChatModelParams('face', messages, 'text')
    const prompt = await chatModel.getResponse(chatParams, 'text')
    promptStore.prompts.image.face = prompt
    const imageParams = getImageModelParams('face', prompt)
    return await imageModel.getResponse(imageParams)
  }

  // Video Model

  async function getPose(messages: Messages) {
    const chatParams = getChatModelParams('pose', messages, 'text')
    const prompt = await chatModel.getResponse(chatParams, 'text')
    promptStore.prompts.video.pose = prompt
    const videoParams = getVideoModelParams('pose', prompt)
    stateStore.poseId = await videoModel.getResponse(videoParams)
    stateStore.appInfo = stateStore.poseId
  }

  return { getCase, getStory, getTest, getAct, getRate, getFace, getPose }
}
