# Error Response

- 400 Bad Request：请求无效或缺少参数，可能存在跨域（CORS）问题。
- 401 Unauthorized：凭证无效（OAuth 会话已过期，或 API 密钥被禁用/无效）。
- 402 Payment Required：您的账户或 API 密钥余额不足，请充值后重试。
- 403 Forbidden：您选择的模型需通过内容审核，您的输入因违规被拦截。
- 408 Request Timeout：请求超时，请稍后重试。
- 429 Too Many Requests：请求频率超限，请降低调用频率。
- 502 Bad Gateway：您选择的模型服务异常，或返回了无效响应。
- 503 Service Unavailable：当前无满足路由要求的模型服务可用。
