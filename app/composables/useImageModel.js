export default function () {
  async function getResponse(params) {
    const stateStore = useStateStore()
    stateStore.modelResponseField = '头像'
    const body = params.body ? JSON.parse(params.body) : {}
    console.log(body.model)
    if (body.model === 'cogview-3-flash') {
      const response = await $fetch('/model/image', {
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
    if (body.model === 'google/gemini-2.5-flash-image-preview:free') {
      params.body = JSON.stringify({
        model: body.model,
        messages: [
          {
            role: 'user',
            content: '必须生成一张图片，根据下面的文字，' + body.prompt,
          },
        ],
        modalities: ['image', 'text'],
      })
      const response = await $fetch('/model/chat', {
        baseURL: stateStore.apiBaseUrl,
        method: 'POST',
        body: {
          params: params,
        },
        // ignoreResponseError: true,
      })
      if (response.error) {
        stateStore.appInfos.push(response.error.message)
        return '/heroimage.png'
      }
      // return response.data?.[0]?.url
      console.log(response)
      const images = response.choices[0].message.images
      console.log(images[0].image_url.url)
      const url = images[0].image_url.url
      return url
    }
  }

  return {
    getResponse,
  }
}
