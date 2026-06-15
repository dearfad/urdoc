export async function handle(body: {
  task?: string
  model: { apiKey: string; baseURL: string; name: string }
  input?: string
  prompt_audio_url?: string
  prompt_text?: string
  taskId?: string
}) {
  const { task, model, input, prompt_audio_url, prompt_text, taskId } = body

  if (!task) {
    throw createError({
      statusCode: 400,
      statusMessage: 'task 不能为空（create 或 query）',
    })
  }

  const config = useRuntimeConfig()
  const apiKey = config[model.apiKey as string] as string
  if (!apiKey) {
    throw createError({ statusCode: 400, statusMessage: 'API Key 未配置' })
  }

  if (task === 'create') {
    if (!input) {
      throw createError({ statusCode: 400, statusMessage: 'input（合成文本）不能为空' })
    }

    const baseURL = (model.baseURL as string)?.replace(/\/+$/, '')
    const reqBody: Record<string, unknown> = {
      model: model.name,
      inputs: input,
    }
    if (prompt_audio_url) reqBody.prompt_audio_url = prompt_audio_url
    if (prompt_text) reqBody.prompt_text = prompt_text

    const res = await fetch(`${baseURL}/async/audio/speech`, {
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
        statusMessage: `Gitee Audio API 错误: ${errBody}`,
      })
    }

    const json = await res.json()
    return {
      taskId: json.task_id,
      urls: json.urls,
    }
  }

  if (task === 'query') {
    if (!taskId) {
      throw createError({
        statusCode: 400,
        statusMessage: '查询任务时 taskId 不能为空',
      })
    }

    const baseURL = (model.baseURL as string)?.replace(/\/+$/, '')
    const queryURL = `${baseURL.replace(/\/v1$/, '')}/api/v1/task/${taskId}`

    const res = await fetch(queryURL, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    })

    if (!res.ok) {
      const errBody = await res.text()
      throw createError({
        statusCode: res.status,
        statusMessage: `Gitee Audio API 错误: ${errBody}`,
      })
    }

    const json = await res.json()
    return {
      status: json.status,
      file_url: json.output?.file_url,
    }
  }

  throw createError({
    statusCode: 400,
    statusMessage: `未知 task: ${task}，仅支持 create 和 query`,
  })
}
