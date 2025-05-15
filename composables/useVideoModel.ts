export default function () {
  async function getResponse(params: ModelParamsType) {
    const stateStore = useStateStore()
    stateStore.modelResponseField = '姿态'
    const response: BigmodelCogvideoxIdResponse = await $fetch('/video/generations', {
      baseURL: stateStore.apiBaseUrl,
      method: 'POST',
      body: {
        params: params,
      },
    })
    return response.id
  }

  async function getUrl(id: string) {
    const stateStore = useStateStore()
    stateStore.modelResponseField = '姿态'
    const params = {
      id: id,
    }
    const response: BigmodelCogvideoxResponse = await $fetch('/video/url', {
      baseURL: stateStore.apiBaseUrl,
      method: 'POST',
      body: {
        params: params,
      },
    })
    // 根据 model.id 选择对应的配置
    if (response.video_result) {
      return response.video_result[0].url
    } else {
      return ''
    }
  }

  return {
    getResponse,
    getUrl,
  }
}
