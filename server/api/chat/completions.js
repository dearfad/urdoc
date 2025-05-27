export default defineEventHandler(async (event) => {
  const { params } = await readBody(event)
  const headers = params.headers
  const body = params.body
  const apiKeyValue = process.env[params.apiKeyName]
  headers.Authorization += apiKeyValue
  return await fetch(params.url, {
    method: 'POST',
    headers: headers,
    body: body,
  })
})
