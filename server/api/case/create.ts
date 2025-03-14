export default defineEventHandler(async (event) => {
  const { params } = await readBody(event)
  // console.log(params.url)
  return await $fetch(params.url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + process.env.BIGMODEL_API_KEY,
    },
    body: {
      model: params.model,
      messages: params.messages,
      stream: true,
      temperature: 0.95,
      top_p: 0.7,
      max_tokens: 1024,
      response_format: params.responseFormat,
    },
    responseType: 'stream',
  })
})
