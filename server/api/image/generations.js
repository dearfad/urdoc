export default defineEventHandler(async (event) => {
  const { params } = await readBody(event)
  params.headers.Authorization += process.env[params.apiKey]
  const response = await fetch(params.url, {
    method: 'POST',
    headers: params.headers,
    body: params.body,
  })
  return await response.json()
})
