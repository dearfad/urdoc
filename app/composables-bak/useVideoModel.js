export default function () {
  async function getResponse(params) {
    const stateStore = useStateStore()
    stateStore.modelResponseField = '姿态'
    const response = await $fetch('/fetch', {
      baseURL: stateStore.apiBaseUrl,
      method: 'POST',
      body: {
        params: params,
      },
    })
    return response.id
  }

  async function getUrl(id) {
    const stateStore = useStateStore()
    stateStore.modelResponseField = '姿态'
    const params = {
      url: `https://open.bigmodel.cn/api/paas/v4/async-result/${id}`,
      method: 'GET',
      apiKeyName: 'ZHIPU_API_KEY',
      headers: {
        'Content-Type': 'application/json',
      },
    }
    const response = await $fetch('/fetch', {
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
