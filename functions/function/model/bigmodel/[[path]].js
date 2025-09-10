// 智谱AI开放平台 https://bigmodel.cn/
// API文档 https://docs.bigmodel.cn/cn/api/introduction

// API KEY 解码
import { unmask } from '../../utils/mask.js'

// 路由前缀
const PATH_PREFIX = '/function/model/bigmodel'
export async function onRequest({ request, env }) {
  const { pathname } = new URL(request.url)
  const route = pathname.slice(PATH_PREFIX.length) || '/'

  if (route.startsWith('/chat')) return chatCompletions(request, env)

  return sendErrorResponse(ROUTE_NOT_FOUND_ERROR)
}

// 接口
const API_BASE = 'https://open.bigmodel.cn/api'
const CHAT_COMPLETIONS = '/paas/v4/chat/completions'

// 免费模型
const FREE_MODELS = [
  'glm-4.5-flash',
  'glm-4.1v-thinking-flash',
  'glm-4-flash-250414',
  'glm-4v-flash',
  'glm-z1-flash',
  'cogview-3-flash',
  'cogvideox-flash',
]

// 错误信息
// OpenRouter Error Response
// https://openrouter.ai/docs/api-reference/errors
// 400 Bad Request：请求无效或缺少参数，可能存在跨域（CORS）问题。
// 401 Unauthorized：凭证无效（OAuth 会话已过期，或 API 密钥被禁用/无效）。
// 402 Payment Required：您的账户或 API 密钥余额不足，请充值后重试。
// 403 Forbidden：您选择的模型需通过内容审核，您的输入因违规被拦截。
// 408 Request Timeout：请求超时，请稍后重试。
// 429 Too Many Requests：请求频率超限，请降低调用频率。
// 502 Bad Gateway：您选择的模型服务异常，或返回了无效响应。
// 503 Service Unavailable：当前无满足路由要求的模型服务可用。
// ... other errors ...
// 404 - Not Found（资源不存在）
// 500 - Internal Server Error（服务器内部错误）
// ....................

const ROUTE_NOT_FOUND_ERROR = {
  error: {
    code: 404,
    message: 'Not Found: No matching route',
  },
}

const NO_FREE_MODEL_ERROR = {
  error: {
    code: 403,
    message: 'Forbidden: Model not in free model list',
  },
}

function validateFreeModel(payload) {
  // 如果提供了API密钥或API密钥名称，则可以使用任意模型
  if (payload.apiKey || payload.apiKeyName) {
    return true
  }

  // 否则检查模型是否在免费列表中
  return FREE_MODELS.includes(payload.model)
}

function getToken(payload, env) {
  // 判断1：提供apiKey可使用任意模型，否则仅可使用免费模型
  if (payload.apiKey) return unmask(env['NUXT_URDOC_SECRET_KEY'], payload.apiKey) || ''
  // 判断2：如果存在且不为空则使用，否则使用默认apiKeyName
  if (payload.apiKeyName) return env[payload.apiKeyName] || ''
  // 默认使用智谱apiKey
  return env['ZHIPU_API_KEY'] || ''
}

function sendErrorResponse(errorResponse) {
  // type ErrorResponse = {
  //   error: {
  //     code: number,
  //     message: string,
  //     metadata?: Record<string, unknown>,
  //   },
  // }
  return new Response(JSON.stringify(errorResponse), {
    status: errorResponse.error.code,
    headers: { 'Content-Type': 'application/json' },
  })
}

// 对话补全 文本模型
async function chatCompletions(request, env) {
  const payload = await request.json()

  if (!validateFreeModel(payload)) return sendErrorResponse(NO_FREE_MODEL_ERROR)

  // 删除 accept-encoding 头避免压缩影响 SSE 流
  request.headers.delete('accept-encoding')

  const url = `${API_BASE}${CHAT_COMPLETIONS}`
  const token = getToken(payload, env)
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }

  const body = {
    model: payload.model || '',
    messages: payload.messages || '',
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

  if (response.status !== 200) {
    const errorFromModel = await response.json()
    return sendErrorResponse(errorFromModel)
  }

  return sendResponse(response)
}

async function sendResponse(response) {
  // 检查是否为SSE流
  const contentType = response.headers.get('Content-Type') || ''
  if (contentType.includes('text/event-stream')) {
    // 处理SSE流
    const { readable, writable } = new TransformStream()
    const writer = writable.getWriter()
    const encoder = new TextEncoder()

    // 读取SSE流并提取内容
    processSSEStream(response.body, writer, encoder)

    return new Response(readable, {
      status: response.status,
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-store',
        Connection: 'keep-alive',
      },
    })
  } else {
    // 非SSE流直接返回
    return new Response(response.body, {
      status: response.status,
      headers: {
        'Content-Type': response.headers.get('Content-Type'),
        'Cache-Control': 'no-store',
      },
    })
  }
}

async function processSSEStream(stream, writer, encoder) {
  const reader = stream.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  try {
    while (true) {
      const { done, value } = await reader.read()

      if (done) {
        break
      }

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')

      // 保留最后一行不完整的数据
      buffer = lines.pop() || ''

      for (const line of lines) {
        // 提取data部分
        if (line.startsWith('data:')) {
          const data = line.slice(5).trim() // 移除 'data:' 前缀
          if (data === '[DONE]') {
            // 流结束标记
            writer.close()
            return
          }

          try {
            const parsed = JSON.parse(data)
            // 提取内容并重新格式化
            const content = extractContent(parsed)
            if (content) {
              writer.write(encoder.encode(`data: ${JSON.stringify(content)}\n\n`))
            }
          } catch (e) {
            // 如果不是JSON，直接转发
            writer.write(encoder.encode(`${line}\n\n`))
          }
        } else if (line.startsWith('event:') || line.startsWith('id:')) {
          // 转发事件类型和ID行
          writer.write(encoder.encode(`${line}\n\n`))
        }
      }
    }

    // 处理剩余缓冲区数据
    if (buffer) {
      if (buffer.startsWith('data:')) {
        const data = buffer.slice(5).trim()
        try {
          const parsed = JSON.parse(data)
          const content = extractContent(parsed)
          if (content) {
            writer.write(encoder.encode(`data: ${JSON.stringify(content)}\n\n`))
          }
        } catch (e) {
          writer.write(encoder.encode(`${buffer}\n\n`))
        }
      } else {
        writer.write(encoder.encode(`${buffer}\n\n`))
      }
    }

    writer.close()
  } catch (error) {
    console.error('Error processing SSE stream:', error)
    writer.close()
  } finally {
    reader.releaseLock()
  }
}

function extractContent(data) {
  // 根据智谱AI API响应格式提取内容
  if (data.choices && data.choices.length > 0) {
    const choice = data.choices[0]
    if (choice.delta) {
      // 流式响应
      //
      // return {
      //   id: data.id,
      //   created: data.created,
      //   model: data.model,
      //   choices: [
      //     {
      //       index: choice.index,
      //       delta: {
      //         role: choice.delta.role,
      //         content: choice.delta.content || '',
      //         reasoning_content: choice.delta.reasoning_content || '',
      //       },
      //     },
      //   ],
      // }
      //
      return {
        content: choice.delta.content || '',
        reasoning_content: choice.delta.reasoning_content || '',
      }
    } else if (choice.message) {
      // 非流式响应
      // return {
      //   id: data.id,
      //   created: data.created,
      //   model: data.model,
      //   request_id: data.request_id,
      //   usage: {
      //     completion_tokens: data.usage.completion_tokens,
      //     prompt_tokens: data.usage.prompt_tokens,
      //     total_tokens: data.usage.total_tokens,
      //     prompt_tokens_details: data.usage.prompt_tokens_details || '',
      //   },
      //   choices: [
      //     {
      //       index: choice.index,
      //       finish_reason: choice.finish_reason,
      //       message: {
      //         role: choice.message.role,
      //         content: choice.message.content || '',
      //         reasoning_content: choice.message.reasoning_content || '',
      //       },
      //     },
      //   ],
      // }
      //
      return {
        content: choice.message.content || '',
        reasoning_content: choice.message.reasoning_content || '',
      }
    }
  }

  // 如果没有匹配的格式，返回原始数据
  return data
}
