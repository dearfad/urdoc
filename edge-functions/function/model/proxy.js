import { unmask } from '../utils/mask.js'
export async function onRequest({ request, env }) {
  const payload = await request.json()
  // 检查请求来源，防止跨域访问
  if (env.NODE_ENV === 'production' && request.headers.get('origin') !== env.ALLOWED_ORIGINS) {
    return sendErrorResponse(CORS_FORBIDDEN)
  }
  // 删除 accept-encoding 头避免压缩影响 SSE 流
  request.headers.delete('accept-encoding')

  if (payload.source != 'local') {
    const token = getToken(payload, env)
    if (!token) return sendErrorResponse(API_KEY_ERROR)
    payload.headers.Authorization = `Bearer ${token}`
  }
  try {
    const params = {
      method: payload.method,
      headers: payload.headers,
    }
    if (payload.method === 'POST') {
      params.body = JSON.stringify(payload.body)
    }
    const response = await fetch(payload.url, params)
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
}

const API_KEY_ERROR = {
  error: {
    code: 401,
    message: 'Valid API Key/Name MUST be provided',
  },
}

const CORS_FORBIDDEN = {
  error: {
    code: 403,
    message: 'CORS Forbidden',
  },
}

const FREE_MODELS_MAP = {
  ZHIPU_API_KEY: ['glm-4.5-flash', 'glm-4-flash-250414', 'cogview-3-flash', 'cogvideox-flash'],
  XFYUN_API_KEY: ['lite'],
  HUNYUAN_API_KEY: ['hunyuan-lite'],
  SHUSHENG_API_KEY: ['internlm3-8b-instruct', 'intern-s1', 'intern-s1-mini', 'internlm2.5-latest'],
}

function getToken(payload, env) {
  if (payload.apiKey) return unmask(env['NUXT_URDOC_SECRET_KEY'], payload.apiKey)

  if (Object.keys(FREE_MODELS_MAP).includes(payload.apiKeyName)) {
    return getFreeApiKey(payload.apiKeyName, payload.body.model, env)
  } else {
    return env[payload.apiKeyName] || ''
  }
}

function getFreeApiKey(apiKeyName, model, env) {
  if (FREE_MODELS_MAP[apiKeyName].includes(model)) {
    return env[apiKeyName]
  }
  return ''
}

function sendErrorResponse(errorResponse) {
  return new Response(JSON.stringify(errorResponse), {
    status: errorResponse.error.code,
    headers: { 'Content-Type': 'application/json' },
  })
}
