export default defineEventHandler(async (event) => {
  const { params } = await readBody(event)
  const apiKey = process.env.BIGMODEL_API_KEY as string
  const url = 'https://open.bigmodel.cn/api/paas/v4/images/generations'
  const response: BigmodelCogviewResponse = await $fetch(url, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + apiKey,
    },
    body: {
      model: 'cogview-3-flash',
      prompt: params.prompt,
    },
  })
  return response.data[0].url
})
