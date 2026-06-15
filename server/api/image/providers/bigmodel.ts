export async function handle(body: {
  prompt: string
  model: { apiKey: string; baseURL: string; name: string }
  size?: string
  quality?: string
}) {
  const { prompt, model, size, quality } = body

  if (!prompt) {
    throw createError({ statusCode: 400, statusMessage: 'prompt 不能为空' })
  }

  const config = useRuntimeConfig()
  const apiKey = config[model.apiKey as string] as string

  if (!apiKey) {
    throw createError({ statusCode: 400, statusMessage: 'API Key 未配置' })
  }

  const reqBody: Record<string, unknown> = {
    model: model.name,
    prompt,
  }
  if (size) reqBody.size = size
  if (quality) reqBody.quality = quality

  const url = `${model.baseURL.replace(/\/$/, '')}/images/generations`

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(reqBody),
  })

  if (!res.ok) {
    const errBody = await res.text()
    throw createError({
      statusCode: res.status,
      statusMessage: `BigModel API 错误: ${errBody}`,
    })
  }

  const json: { data?: { url: string }[] } = await res.json()
  const imageUrls = json.data?.map((d) => d.url) ?? []

  const images = await Promise.all(
    imageUrls.map(async (imgUrl) => {
      const imgRes = await fetch(imgUrl)
      const arrayBuffer = await imgRes.arrayBuffer()
      const mediaType = imgRes.headers.get('content-type') || 'image/png'
      return {
        base64: Buffer.from(arrayBuffer).toString('base64'),
        mediaType,
      }
    }),
  )

  return { images, originalUrls: imageUrls }
}
