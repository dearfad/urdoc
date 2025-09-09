// 智谱AI开放平台 https://bigmodel.cn/
// API文档 https://docs.bigmodel.cn/cn/api/introduction

// API KEY 解码
import { unmask } from '../../utils/mask.js'

// 路由前缀
const PATH_PREFIX = '/function/model/bigmodel'

// 接口
const API_BASE = 'https://open.bigmodel.cn/api'
const CHAT_COMPLETIONS = '/paas/v4/chat/completions'

// 功能路由
export async function onRequest({ request, env }) {
  const { pathname } = new URL(request.url)
  const route = pathname.slice(PATH_PREFIX.length) || '/'

  if (route.startsWith('/chat')) return chatCompletions(request, env)

  // TODO: error handling
  return new Response(JSON.stringify(route))
}

function getToken(payload, env) {
  // 判断1：提供apiKey可使用任意模型，否则仅可使用免费模型
  if (payload.apiKey) return unmask(env['NUXT_URDOC_SECRET_KEY'], payload.apiKey) || ''
  // 判断2：如果存在且不为空则使用，否则使用默认apiKeyName
  if (payload.apiKeyName) return env[payload.apiKeyName] || ''
  // 默认使用智谱apiKey
  return env['ZHIPU_API_KEY'] || ''
}

function streamResponse(response) {
  return new Response(response.body, {
    status: response.status,
    headers: {
      'Content-Type': response.headers.get('Content-Type') || 'application/octet-stream',
      'Cache-Control': 'no-store',
    },
  })
}

// 400 - Bad Request（请求参数错误）
// 401 - Unauthorized（未授权）
// 403 - Forbidden（禁止访问）
// 404 - Not Found（资源不存在）
// 500 - Internal Server Error（服务器内部错误）

// 对话补全 文本模型
async function chatCompletions(request, env) {
  const payload = await request.json()

  // 删除 accept-encoding 头避免压缩影响 SSE 流
  request.headers.delete('accept-encoding')

  const url = `${API_BASE}${CHAT_COMPLETIONS}`
  const token = getToken(payload, env)
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }
  const body = {
    model: payload.model || 'glm-4-flash-250414',
    messages: payload.messsages || '',
    stream: payload.stream || false,
    response_format: payload.format === 'json' ? { type: 'json_object' } : { type: 'text' },
    // thinking: {
    //   type: 'enabled',
    // },
    // do_sample: true,
    // temperature: 0.6,
    // top_p: 0.95,
    // max_tokens: 32768,
    // tools: [],
    // "tool_choice": "auto",
    // stop:[],
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(body),
  })

  return streamResponse(response)
}
