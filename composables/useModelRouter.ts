import useChatModel from './useChatModel'

export default function () {
  const stateStore = useStateStore()
  const chatModel = useChatModel()
  const faceModelResponse = useFaceModelResponse()
  const caseStore = useCaseStore()

  function getChatModelParams(
    modelUsage: keyof typeof stateStore.models.chat,
    messages: MessagesArray,
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

  async function getCase(messages: MessagesArray) {
    const params = getChatModelParams('case', messages, caseStore.caseContentFields)
    return await chatModel.getResponse(params)
  }

  async function getStory(messages: MessagesArray) {
    const params = getChatModelParams('story', messages, caseStore.caseStoryFields)
    return await chatModel.getResponse(params)
  }

  async function getTest(messages: MessagesArray) {
    const params = getChatModelParams('test', messages, caseStore.caseTestFields)
    return await chatModel.getResponse(params)
  }

  async function getAct(messages: MessagesArray) {
    const params = getChatModelParams('act', messages, [], { type: 'text' })
    return await chatModel.getResponse(params)
  }

  async function getRate(messages: MessagesArray) {
    const params = getChatModelParams('rate', messages, [], { type: 'text' })
    return await chatModel.getResponse(params)
  }

  async function getFaceUrl() {
    return await faceModelResponse.getResponse()
  }

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
          image_url: `${caseStore.caseFaceUrl}`,
        },
      }
    )
    return response.id
  }

  async function getPose() {
    stateStore.modelResponseField = '获取视频'
    const response: BigmodelCogvideoxResponse = await $fetch(
      `https://open.bigmodel.cn/api/paas/v4/async-result/${caseStore.casePoseId}`,
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

  return { getCase, getStory, getTest, getAct, getRate, getFaceUrl, getPoseId, getPose }
}
