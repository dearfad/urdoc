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
      temperature: 0.9,
      top_p: 1.0,
      max_tokens: 4095,
    },
    responseType: 'stream',
  })
})
