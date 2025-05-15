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
    watchFields: string[],
    responseFormat: ResponseFormatType = { type: 'json_object' }
  ) {
    const params: ModelParamsType = {
      model: stateStore.models.chat[modelUsage],
      messages: messages,
      watchFields: watchFields,
      responseFormat: responseFormat,
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
    const params = getChatModelParams('case', messages, recordStore.watchFields.case)
    return await chatModel.getResponse(params)
  }

  async function getStory(messages: Messages) {
    const params = getChatModelParams('story', messages, [])
    return await chatModel.getResponse(params)
  }

  async function getTest(messages: Messages) {
    const params = getChatModelParams('test', messages, [])
    return await chatModel.getResponse(params)
  }

  async function getAct(messages: Messages) {
    const params = getChatModelParams('act', messages, [], { type: 'text' })
    return await chatModel.getResponse(params)
  }

  async function getRate(messages: Messages) {
    const params = getChatModelParams('rate', messages, [], { type: 'text' })
    return await chatModel.getResponse(params)
  }

  // Image Model

  async function getFace(messages: Messages) {
    const params = getChatModelParams('face', messages, [], { type: 'text' })
    const prompt = await chatModel.getResponse(params)
    promptStore.prompts.image.face = prompt
    const paramsImage = getImageModelParams('face', prompt)
    return await imageModel.getResponse(paramsImage)
  }

  // Video Model

  async function getPose(messages: Messages) {
    const params = getChatModelParams('pose', messages, [], { type: 'text' })
    const prompt = await chatModel.getResponse(params)
    promptStore.prompts.video.pose = prompt
    const paramsVideo = getVideoModelParams('pose', prompt)
    stateStore.poseId = await videoModel.getResponse(paramsVideo)
    stateStore.appInfo = stateStore.poseId
  }

  return { getCase, getStory, getTest, getAct, getRate, getFace, getPose }
}
