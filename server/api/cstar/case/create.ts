export default defineEventHandler(async (event) => {
  const { params } = await readBody(event)
  let apiKey = ''
  let url = ''
  switch (params.platform) {
    case '智谱':
      apiKey = process.env.BIGMODEL_API_KEY as string
      url = 'https://open.bigmodel.cn/api/paas/v4/chat/completions'
      break
    case '讯飞':
      apiKey = process.env.XFYUN_API_KEY as string
      // url = '/api/xfyun/v1/chat/completions'
      url = 'https://spark-api-open.xf-yun.com/v1/chat/completions'
      break
    case '火山方舟':
      apiKey = process.env.DOUBAO_API_KEY as string
      url = 'https://ark.cn-beijing.volces.com/api/v3/chat/completions'
      break
    case '阿里云百炼':
      apiKey = process.env.ALIYUN_API_KEY as string
      url = 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions'
      break
    default:
      apiKey = process.env.BIGMODEL_API_KEY as string
      url = 'https://open.bigmodel.cn/api/paas/v4/chat/completions'
      break
  }

  return await $fetch(url, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + apiKey,
    },
    body: {
      model: params.model,
      messages: params.messages,
      response_format: params.responseFormat,
      stream: true,
      // temperature: 0.95,
      // top_p: 0.7,
      // max_tokens: 1024,
    },
    responseType: 'stream',
  })
})
