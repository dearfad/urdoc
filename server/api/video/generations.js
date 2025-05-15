export default defineEventHandler(async (event) => {
  const { params } = await readBody(event)
  const providerApiKey = process.env[params.model.key.provider]
  // const gatewayApiKey = process.env[params.model.key.gateway]
  const model = params.model

  const fetchConfigs = {
    'cogvideox-flash': {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + providerApiKey,
      },
      body: {
        model: model.id,
        prompt: params.prompt,
        image_url: params.image_url,
      },
      default: {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + providerApiKey,
        },
        body: {
          model: model.id,
          prompt: params.prompt,
          image_url: params.image_url,
        },
      },
    },
  }
  // 根据 model.id 选择对应的配置
  const fetchConfig = fetchConfigs[params.model.id] || fetchConfigs.default

  return await $fetch(model.url, {
    method: 'POST',
    ...fetchConfig,
  })
})
