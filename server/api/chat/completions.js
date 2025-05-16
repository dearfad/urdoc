export default defineEventHandler(async (event) => {
  const { params } = await readBody(event)
  const providerApiKey = process.env[params.model.key.provider]
  const gatewayApiKey = process.env[params.model.key.gateway]
  const model = params.model
  // 定义不同 gateway 的处理逻辑
  const fetchConfigs = {
    EdgeOne: {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + providerApiKey,
        'OE-Gateway-Version': 2,
        'OE-Key': gatewayApiKey,
        'OE-Gateway-Name': 'urdoc',
        'OE-AI-Provider': 'ali',
      },
      body: {
        model: model.id,
        messages: params.messages,
        response_format: params.responseFormat,
        stream: true,
      },
    },
    OpenRouter: {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + gatewayApiKey,
      },
      body: {
        model: model.id,
        messages: params.messages,
        stream: true,
      },
    },
    ModelScope: {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + gatewayApiKey,
      },
      body: {
        model: model.id,
        messages: params.messages,
        stream: true,
      },
    },
    default: {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + providerApiKey,
      },
      body: {
        model: model.id,
        messages: params.messages,
        response_format: params.responseFormat,
        stream: true,
      },
    },
  }

  // 根据 model.gateway 选择对应的配置
  const fetchConfig = fetchConfigs[params.model.gateway] || fetchConfigs.default

  return await $fetch(model.url, {
    method: 'POST',
    ...fetchConfig,
    responseType: 'stream',
  })
})
