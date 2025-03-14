export default function () {
  const stateStore = useStateStore()
  const modelResponse = useModelResponse()
  const caseStore = useCaseStore()

  function getModelParams(
    messages: MessagesArray,
    watchFields: string[],
    responseFormat: ResponseFormatType = { type: 'json_object' }
  ) {
    const modelParams: ModelParamsType = {
      apiKey: '',
      model: stateStore.selectedModel.id,
      url: '',
      messages: messages,
      watchFields: watchFields,
      responseFormat: responseFormat,
    }

    switch (stateStore.selectedPlatform) {
      // nuxt.config.ts 处理CORS跨域请求
      // routeRules: {
      //     '/api/xfyun/**': {
      //         proxy: 'https://spark-api-open.xf-yun.com/**',
      //     },
      //     '/api/doubao/**': {
      //         proxy: 'https://ark.cn-beijing.volces.com/**',
      //     },
      // },
      case '智谱':
        modelParams.apiKey = process.env.BIGMODEL_API_KEY
        modelParams.url = 'https://open.bigmodel.cn/api/paas/v4/chat/completions'
        break
      case '讯飞':
        modelParams.apiKey = process.env.XFYUN_API_KEY
        modelParams.url = '/api/xfyun/v1/chat/completions'
        break
      case '火山方舟':
        modelParams.apiKey = process.env.DOUBAO_API_KEY
        modelParams.url = '/api/doubao/api/v3/chat/completions'
        break
      case '阿里云百炼':
        modelParams.apiKey = process.env.ALIYUN_API_KEY
        modelParams.url = 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions'
        break
      default:
        stateStore.appInfo = '未知平台！'
        break
    }
    return modelParams
  }

  async function getCase(messages: MessagesArray) {
    const params = getModelParams(messages, caseStore.caseContentFields)
    return await modelResponse.getResponse(params)
  }

  async function getStory(messages: MessagesArray) {
    const params = getModelParams(messages, caseStore.caseStoryFields)
    return await modelResponse.getResponse(params)
  }

  async function getTest(messages: MessagesArray) {
    const params = getModelParams(messages, caseStore.caseTestFields)
    return await modelResponse.getResponse(params)
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
