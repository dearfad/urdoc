export default function () {
  const stateStore = useStateStore()
  const recordStore = useRecordStore()
  const chatModel = useChatModel()
  const imageModel = useImageModel()
  // const videoModel = useVideoModel()
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

  function getImageModelParams(modelUsage: keyof typeof stateStore.models.images) {
    const params: ModelParamsType = {
      model: stateStore.models.images[modelUsage],
      prompt: `${recordStore.view.case.markdown}, ${promptStore.facePrompt}`,
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

  async function getFace() {
    const params = getImageModelParams('face')
    return await imageModel.getResponse(params)
  }

  // Video Model

  async function getPoseId() {
    stateStore.modelResponseField = '视频'
    const response: BigmodelCogvideoxResponse = await $fetch(
      'https://open.bigmodel.cn/api/paas/v4/videos/generations',
      {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + import.meta.env.VITE_BIGMODEL_API_KEY,
        },
        body: {
          model: 'cogvideox-flash',
          prompt: '表情痛苦',
          image_url: `${recordStore.caseFaceUrl}`,
        },
      }
    )
    return response.id
  }

  async function getPose() {
    stateStore.modelResponseField = '获取视频'
    const response: BigmodelCogvideoxResponse = await $fetch(
      `https://open.bigmodel.cn/api/paas/v4/async-result/${recordStore.casePoseId}`,
      {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + import.meta.env.VITE_BIGMODEL_API_KEY,
        },
      }
    )
    if (response.video_result) {
      return response.video_result[0].url
    } else {
      return ''
    }
  }

  return { getCase, getStory, getTest, getAct, getRate, getFace, getPoseId, getPose }
}
