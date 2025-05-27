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
      apiKeyName: model.key.gateway || model.key.provider,
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
    const params: ModelParamsType = {
      model: stateStore.models.image[modelUsage],
      prompt: prompt,
    }
    return params
  }

  function getVideoModelParams(modelUsage: keyof typeof stateStore.models.video, prompt: string) {
    const params: ModelParamsType = {
      model: stateStore.models.video[modelUsage],
      prompt: prompt,
      image_url: recordStore.record.face,
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
    return await chatModel.getResponse(params, 'json', [])
  }

  async function getTest(messages: Messages) {
    const params = getChatModelParams('test', messages, 'json')
    return await chatModel.getResponse(params, 'json', [])
  }

  async function getAct(messages: Messages) {
    const params = getChatModelParams('act', messages, 'text')
    return await chatModel.getResponse(params, 'text', [])
  }

  async function getRate(messages: Messages) {
    const params = getChatModelParams('rate', messages, 'text')
    return await chatModel.getResponse(params, 'text', [])
  }

  // Image Model

  async function getFace(messages: Messages) {
    const params = getChatModelParams('face', messages, 'text')
    const prompt = await chatModel.getResponse(params, 'text', [])
    promptStore.prompts.image.face = prompt
    const paramsImage = getImageModelParams('face', prompt)
    return await imageModel.getResponse(paramsImage)
  }

  // Video Model

  async function getPose(messages: Messages) {
    const params = getChatModelParams('pose', messages, 'text')
    const prompt = await chatModel.getResponse(params, 'text', [])
    promptStore.prompts.video.pose = prompt
    const paramsVideo = getVideoModelParams('pose', prompt)
    stateStore.poseId = await videoModel.getResponse(paramsVideo)
    stateStore.appInfo = stateStore.poseId
  }

  return { getCase, getStory, getTest, getAct, getRate, getFace, getPose }
}
