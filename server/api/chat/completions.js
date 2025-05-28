export default defineEventHandler(async (event) => {
  const { params } = await readBody(event)
  params.headers.Authorization += process.env[params.apiKey]
  return await fetch(params.url, {
    method: 'POST',
    headers: params.headers,
    body: params.body,
  })
})
