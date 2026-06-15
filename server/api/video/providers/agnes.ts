export async function handle(body: {
  task: string
  model: { apiKey: string; baseURL: string; name: string }
  prompt?: string
  image?: string
  taskId?: string
  num_frames?: number
  frame_rate?: number
  width?: number
  height?: number
  negative_prompt?: string
  seed?: number
}) {
  const { task, model, prompt, image, taskId, num_frames, frame_rate, width, height, negative_prompt, seed } = body

  if (!task) {
    throw createError({ statusCode: 400, statusMessage: 'task 不能为空（create 或 query）' })
  }

  const config = useRuntimeConfig()
  let apiKey = ''
  let baseURL = ''

  if (model) {
    apiKey = config[model.apiKey as string] as string
    baseURL = (model.baseURL as string)?.replace(/\/$/, '') ?? ''
    if (!apiKey) {
      throw createError({ statusCode: 400, statusMessage: 'API Key 未配置' })
    }
  }

  if (task === 'create') {
    if (!prompt) {
      throw createError({ statusCode: 400, statusMessage: 'prompt 不能为空' })
    }

    const reqBody: Record<string, unknown> = {
      model: model.name,
      prompt,
    }

    if (image) reqBody.image = image
    if (num_frames != null) reqBody.num_frames = num_frames
    if (frame_rate != null) reqBody.frame_rate = frame_rate
    if (width != null) reqBody.width = width
    if (height != null) reqBody.height = height
    if (negative_prompt) reqBody.negative_prompt = negative_prompt
    if (seed != null) reqBody.seed = seed

    const res = await fetch(`${baseURL}/videos`, {
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
        statusMessage: `Agnes Video API 错误: ${errBody}`,
      })
    }

    const json = await res.json()
    return {
      taskId: json.id,
      object: json.object,
      model: json.model,
      status: json.status,
      progress: json.progress,
      created_at: json.created_at,
    }
  }

  if (task === 'query') {
    if (!taskId) {
      throw createError({ statusCode: 400, statusMessage: '查询任务时 taskId 不能为空' })
    }

    const res = await fetch(`${baseURL}/videos/${taskId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    })

    if (!res.ok) {
      const errBody = await res.text()
      throw createError({
        statusCode: res.status,
        statusMessage: `Agnes Video API 错误: ${errBody}`,
      })
    }

    const json = await res.json()
    return {
      taskId: json.id,
      object: json.object,
      model: json.model,
      status: json.status,
      progress: json.progress,
      created_at: json.created_at,
      completed_at: json.completed_at,
      video_url: json.remixed_from_video_id || json.video_url,
      size: json.size,
      seconds: json.seconds,
      usage: json.usage,
    }
  }

  throw createError({ statusCode: 400, statusMessage: `未知 task: ${task}，仅支持 create 和 query` })
}
