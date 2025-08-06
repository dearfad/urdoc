export default function () {
  async function getResponse(params: ModelParamsType) {
    const stateStore = useStateStore()
    stateStore.modelResponseField = '头像'
    const response: BigmodelCogviewResponse = await $fetch('/llm/fetch', {
      baseURL: stateStore.apiBaseUrl,
      method: 'POST',
      body: {
        params: params,
      },
    })
    return response.data?.[0]?.url
  }

  return {
    getResponse,
  }
}
