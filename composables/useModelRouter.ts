export default function () {
  const stateStore = useStateStore()
  const caseModelResponse = useCaseModelResponse()
  const storyModelResponse = useStoryModelResponse()
  const testModelResponse = useTestModelResponse()
  const modelResponse = useModelResponse()
  const caseStore = useCaseStore()

  function getModelParams(
    messages: MessagesArray,
    watchFields: string[],
    responseFormat: ResponseFormatType = { type: 'json_object' }
  ) {
    const modelParams: ModelParamsType = {
      platform: stateStore.selectedPlatform,
      model: stateStore.selectedModel.id,
      messages: messages,
      watchFields: watchFields,
      responseFormat: responseFormat,
    }

    return modelParams
  }

  async function getCase(messages: MessagesArray) {
    const params = getModelParams(messages, caseStore.caseContentFields)
    return await caseModelResponse.getResponse(params)
  }

  async function getStory(messages: MessagesArray) {
    const params = getModelParams(messages, caseStore.caseStoryFields)
    return await storyModelResponse.getResponse(params)
  }

  async function getTest(messages: MessagesArray) {
    const params = getModelParams(messages, caseStore.caseTestFields)
    return await testModelResponse.getResponse(params)
  }

  async function getAct(messages: MessagesArray) {
    const params = getModelParams(messages, [], { type: 'text' })
    return await modelResponse.getResponse(params)
  }

  async function getRate(messages: MessagesArray) {
    const params = getModelParams(messages, [], { type: 'text' })
    return await modelResponse.getResponse(params)
  }

  async function getFace() {
    stateStore.modelResponseField = '头像'
    const response: BigmodelCogviewResponse = await $fetch(
      'https://open.bigmodel.cn/api/paas/v4/images/generations',
      {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + import.meta.env.VITE_BIGMODEL_API_KEY,
        },
        body: {
          model: 'cogview-3-flash',
          prompt: `${caseStore.caseContentMarkdown}，中国人，半身近照，在医院门诊拍摄。`,
        },
      }
    )
    return response.data[0].url
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
          image_url: `${caseStore.caseFace}`,
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

  return { getCase, getStory, getTest, getAct, getRate, getFace, getPoseId, getPose }
}
