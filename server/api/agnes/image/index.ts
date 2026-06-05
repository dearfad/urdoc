export default defineEventHandler(async (event) => {
  const {
    prompt,
    model,
    n,
    size,
    seed,
    tags,
    image,
  } = await readBody(event)

  if (!prompt) {
    throw createError({ statusCode: 400, statusMessage: 'prompt 不能为空' })
  }

  const config = useRuntimeConfig()
  const apiKey = config[model.apiKey as string] as string

  if (!apiKey) {
    throw createError({ statusCode: 400, statusMessage: 'API Key 未配置' })
  }

  const body: Record<string, unknown> = {
    model: model.name,
    prompt,
    n: n ?? 1,
  }
  if (size) body.size = size
  if (seed != null) body.seed = seed
  if (tags) body.tags = tags
  if (image) body.extra_body = { image }

  const url = `${model.baseURL.replace(/\/$/, '')}/images/generations`

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const errBody = await res.text()
    throw createError({
      statusCode: res.status,
      statusMessage: `Agnes API 错误: ${errBody}`,
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
})
