export default function () {
  async function getResponse(params: ModelParamsType) {
    const stateStore = useStateStore()
    stateStore.modelResponseField = '头像'
    const response: BigmodelCogviewResponse = await $fetch('/image/generations', {
      baseURL: stateStore.apiBaseUrl,
      method: 'POST',
      body: {
        params: params,
      },
    })
    return response.data[0].url
  }

  return {
    getResponse,
  }
}
