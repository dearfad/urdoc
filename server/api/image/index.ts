import { generateText } from 'ai'
import { createOpenAICompatible } from '@ai-sdk/openai-compatible'
import { getPrompt } from '#server/prompts'
import { imageTaskStore } from './store'

const IMAGE_PROVIDER_DEFAULTS: Record<string, { baseURL: string; defaultModel: string }> = {
  Agnes: {
    baseURL: 'https://apihub.agnes-ai.com/v1',
    defaultModel: 'agnes-image-2.1-flash',
  },
}

export interface ImageApiBody {
  type: 'image'
  task: 'face' | 'illustration' | 'generate'
  prompt: string
  messages?: { role: string; content: string }[]
  model: { provider: string; name: string; apiKey: string; baseURL: string }
  imageModel?: { provider: string; name: string; apiKey: string; baseURL: string }
  imageSize?: string
  n?: number
}

export default defineEventHandler(async (event) => {
  const body = await readBody<ImageApiBody>(event)
  const { type, task, prompt, messages, model, imageModel, imageSize, n } = body
  const config = useRuntimeConfig()

  let imagePrompt = prompt

  if (task === 'face' || task === 'illustration') {
    const systemPrompt = await getPrompt(type as any, task as any)
    if (!systemPrompt) {
      throw createError({ statusCode: 400, statusMessage: `未找到任务 ${task} 的提示词模板` })
    }
    const provider = createOpenAICompatible({
      name: model.provider,
      apiKey: config[model.apiKey as keyof typeof config] as string,
      baseURL: model.baseURL,
    })
    const result = await generateText({
      model: provider(model.name),
      system: systemPrompt,
      messages: messages || [{ role: 'user', content: prompt }],
    })
    imagePrompt = result.text.trim()
    if (!imagePrompt) {
      throw createError({ statusCode: 500, statusMessage: '图片描述生成失败' })
    }
  }

  const imgModel = imageModel || model
  const providerKey = imgModel.provider || ''
  const providerCfg = IMAGE_PROVIDER_DEFAULTS[providerKey]

  if (providerCfg) {
    const apiKey = config[imgModel.apiKey as keyof typeof config] as string
    if (!apiKey) {
      throw createError({ statusCode: 400, statusMessage: `${providerKey} API 密钥未配置` })
    }
    try {
      const response = await $fetch(`${providerCfg.baseURL}/images/generations`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: {
          model: imgModel.name || providerCfg.defaultModel,
          prompt: imagePrompt,
          size: imageSize || '1024x768',
        },
      })
      return { sync: true as const, images: response.data as { url: string }[] }
    } catch (err: any) {
      const message = err.data?.error?.message || err.message || '图片生成 API 调用失败'
      throw createError({ statusCode: 502, statusMessage: message })
    }
  }

  // 异步 Provider 处理（预留）
  if (providerKey === 'BigModel' || providerKey === 'ModelScope') {
    const taskId = crypto.randomUUID()
    imageTaskStore.set(taskId, {
      status: 'pending',
      prompt: imagePrompt,
      model: imgModel,
      config,
      createdAt: Date.now(),
    })
    processAsyncImageGeneration(taskId, imagePrompt, imgModel, config)
    return { sync: false as const, taskId }
  }

  throw createError({ statusCode: 400, statusMessage: `不支持的图片生成提供商: ${providerKey}` })
})

async function processAsyncImageGeneration(
  taskId: string,
  prompt: string,
  model: { provider: string; name: string; apiKey: string; baseURL: string },
  config: ReturnType<typeof useRuntimeConfig>,
) {
  try {
    const apiKey = config[model.apiKey as keyof typeof config] as string
    if (!apiKey) {
      imageTaskStore.set(taskId, {
        status: 'failed',
        prompt,
        model,
        config,
        createdAt: Date.now(),
        error: 'API 密钥未配置',
      })
      return
    }

    let baseURL: string
    let endpoint: string
    let headers: Record<string, string> = { 'Content-Type': 'application/json' }

    if (model.provider === 'BigModel') {
      baseURL = 'https://open.bigmodel.cn/api/paas/v4'
      endpoint = '/images/generations'
      headers['Authorization'] = `Bearer ${apiKey}`
    } else if (model.provider === 'ModelScope') {
      baseURL = 'https://api-inference.modelscope.cn/v1'
      endpoint = '/images/generations'
      headers['Authorization'] = `Bearer ${apiKey}`
      headers['X-ModelScope-Async-Mode'] = 'true'
    } else {
      imageTaskStore.set(taskId, {
        status: 'failed',
        prompt,
        model,
        config,
        createdAt: Date.now(),
        error: `不支持的异步提供商: ${model.provider}`,
      })
      return
    }

    const response = await $fetch(`${baseURL}${endpoint}`, {
      method: 'POST',
      headers,
      body: {
        model: model.name,
        prompt,
        size: '1024x1024',
      },
      ignoreResponseError: true,
    })

    const taskIdFromResponse = (response as any)?.id || (response as any)?.task_id
    if (!taskIdFromResponse) {
      const result = response as any
      if (result.data?.[0]?.url) {
        imageTaskStore.set(taskId, {
          status: 'succeeded',
          images: result.data,
          prompt,
          model,
          config,
          createdAt: Date.now(),
        })
        return
      }
      imageTaskStore.set(taskId, {
        status: 'failed',
        prompt,
        model,
        config,
        createdAt: Date.now(),
        error: result.error?.message || '未知错误',
      })
      return
    }

    const taskUrl =
      model.provider === 'BigModel'
        ? `${baseURL}/async-result/${taskIdFromResponse}`
        : `${baseURL}/tasks/${taskIdFromResponse}`

    const MAX_RETRIES = 60
    for (let i = 0; i < MAX_RETRIES; i++) {
      await new Promise((resolve) => setTimeout(resolve, model.provider === 'BigModel' ? 3000 : 1000))

      const pollHeaders: Record<string, string> = { 'Content-Type': 'application/json' }
      if (model.provider === 'ModelScope') {
        pollHeaders['X-ModelScope-Task-Type'] = 'image_generation'
      }

      try {
        const result: any = await $fetch(taskUrl, {
          method: 'GET',
          headers: pollHeaders,
          ignoreResponseError: true,
        })

        if (result.task_status === 'SUCCEED' || result.task_status === 'SUCCESS') {
          const images = result.output_images
            ? result.output_images.map((url: string) => ({ url }))
            : result.video_result
              ? result.video_result.map((v: any) => ({ url: v.url }))
              : result.data || []
          imageTaskStore.set(taskId, { status: 'succeeded', images, prompt, model, config, createdAt: Date.now() })
          return
        }

        if (result.task_status === 'FAILED' || result.task_status === 'FAIL') {
          imageTaskStore.set(taskId, {
            status: 'failed',
            prompt,
            model,
            config,
            createdAt: Date.now(),
            error: result.errors?.message || result.error || '任务失败',
          })
          return
        }
      } catch {
        continue
      }
    }

    imageTaskStore.set(taskId, { status: 'failed', prompt, model, config, createdAt: Date.now(), error: '任务超时' })
  } catch (err: any) {
    imageTaskStore.set(taskId, {
      status: 'failed',
      prompt,
      model,
      config,
      createdAt: Date.now(),
      error: err.message || '未知错误',
    })
  }
}
