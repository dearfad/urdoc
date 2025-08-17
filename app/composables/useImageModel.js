export default function () {
  async function getResponse(params) {
    const stateStore = useStateStore()
    stateStore.modelResponseField = '头像'
    const response = await $fetch('/fetch', {
      baseURL: stateStore.apiBaseUrl,
      method: 'POST',
      body: {
        params: params,
      },
      ignoreResponseError: true,
    })
    if (response.error) {
      stateStore.appInfos.push(response.error.message)
      return '/heroimage.png'
    }
    return response.data?.[0]?.url
  }

  return {
    getResponse,
  }
}
