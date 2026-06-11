export default defineEventHandler(async (event) => {
  const { model, text, style, voice, format } = await readBody(event)

  if (!text) {
    throw createError({ statusCode: 400, statusMessage: 'text（合成文本）不能为空' })
  }

  const config = useRuntimeConfig()
  const apiKey = config[model?.apiKey as string] as string
  if (!apiKey) {
    throw createError({ statusCode: 400, statusMessage: 'API Key 未配置' })
  }

  const baseURL = (model.baseURL as string)?.replace(/\/+$/, '')

  const messages: { role: string; content: string }[] = []
  if (style) {
    messages.push({ role: 'user', content: style })
  }
  messages.push({ role: 'assistant', content: text })

  const body: Record<string, unknown> = {
    model: model.name || 'mimo-v2.5-tts',
    messages,
    audio: {
      format: format || 'wav',
      voice: voice || 'mimo_default',
    },
  }

  const res = await fetch(`${baseURL}/chat/completions`, {
    method: 'POST',
    headers: {
      'api-key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const errBody = await res.text()
    throw createError({
      statusCode: res.status,
      statusMessage: `XiaoMI TTS 错误: ${errBody}`,
    })
  }

  const json = await res.json()
  const audioData = json.choices?.[0]?.message?.audio?.data
  if (!audioData) {
    throw createError({
      statusCode: 500,
      statusMessage: 'XiaoMI API 未返回音频数据',
    })
  }

  const mediaType = format === 'pcm16' ? 'audio/pcm' : 'audio/wav'

  return {
    base64: audioData,
    mediaType,
  }
})
