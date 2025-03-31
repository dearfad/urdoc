export default defineEventHandler(async (event) => {
  const { params } = await readBody(event)
  const model = params.models.chatModel
  const gatewayApiKey = process.env[model.envGatewayApiKeyName]
  const providerApiKey = process.env[model.envProviderApiKeyName]
  // 定义不同 gateway 的处理逻辑
  const handlers = {
    EdgeOne: async () => {
      return await $fetch(model.url, {
        method: 'POST',
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
          // temperature: 0.95,
          // top_p: 0.7,
          // max_tokens: 1024,
        },
        responseType: 'stream',
      })
    },
    OpenRouter: async () => {
      return await $fetch(model.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + gatewayApiKey,
        },
        body: {
          model: model.id,
          messages: params.messages,
          response_format: params.responseFormat,
          stream: true,
        },
        responseType: 'stream',
      })
    },
    default: async () => {
      return await $fetch(model.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + providerApiKey,
        },
        body: {
          model: model.id,
          messages: params.messages,
          response_format: params.responseFormat,
          stream: true,
          // temperature: 0.95,
          // top_p: 0.7,
          // max_tokens: 1024,
        },
        responseType: 'stream',
      })
    },
  }

  // 根据 model.gateway 选择对应的处理逻辑
  const handler = handlers[model.gateway] || handlers.default
  return await handler()
})
