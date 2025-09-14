import { unmask } from '../utils/mask.js'
export default defineEventHandler(async (event) => {
  const payload = await readBody(event)
  const token = getToken(payload, process.env)
  payload.headers.Authorization = `Bearer ${token}`
  try {
    const response = await fetch(payload.url, {
      method: payload.method,
      headers: payload.headers,
      body: payload.body,
    })

    return new Response(response.body, {
      status: response.status,
      headers: response.headers,
    })
  } catch (error) {
    return sendErrorResponse({
      error: {
        code: 500,
        message: error.message,
      },
    })
  }
})

const API_KEY_ERROR = {
  error: {
    code: 401,
    message: 'API Key/Name MUST be provided',
  },
}

function getToken(payload, env) {
  if (payload.apiKey) return unmask(env['NUXT_URDOC_SECRET_KEY'], payload.apiKey)
  if (payload.apiKeyName) return env[payload.apiKeyName]
  return sendErrorResponse(API_KEY_ERROR)
}

function sendErrorResponse(errorResponse) {
  return new Response(JSON.stringify(errorResponse), {
    status: errorResponse.error.code,
    headers: { 'Content-Type': 'application/json' },
  })
}
