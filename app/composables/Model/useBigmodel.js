export default function () {
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

  const INVALID_JSON_RESPONSE_ERROR = {
    error: {
      code: 502,
      message: 'Bad Response: Invalid JSON in SSE stream',
    },
  }

  const SSE_PROCESSING_ERROR = {
    error: {
      code: 500,
      message: 'Error processing SSE stream',
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
  async function getResponse(modelType, modelUsage, messages) {
    if (!validateFreeModel(payload)) return sendErrorResponse(NO_FREE_MODEL_ERROR)
    return
  }

  return {
    getResponse,
  }
}
