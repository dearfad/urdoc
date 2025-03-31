export default defineEventHandler(async (event) => {
  const { params } = await readBody(event)
  const model = params.models.chatModel
  const apiKey = process.env[model.envApiKeyName]
  return await $fetch(model.url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + apiKey,
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
})
