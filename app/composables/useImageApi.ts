let _status: ReturnType<typeof ref<string>> | null = null
let _images: ReturnType<typeof ref<{ url: string }[]>> | null = null
let _error: ReturnType<typeof ref<string | null>> | null = null
let _abortController: AbortController | null = null
let _pollTimer: ReturnType<typeof setInterval> | null = null

export function useImageApi() {
  if (!_status) _status = ref<'idle' | 'streaming' | 'error'>('idle')
  if (!_images) _images = ref<{ url: string }[]>([])
  if (!_error) _error = ref<string | null>(null)

  async function generate(
    prompt: string,
    options: {
      task: string
      model: { provider: string | null; name: string | null; apiKey: string | null; baseURL: string | null }
      messages?: { role: string; content: string }[]
      imageModel?: { provider: string | null; name: string | null; apiKey: string | null; baseURL: string | null }
      imageSize?: string
      n?: number
    },
  ) {
    stop()
    _status!.value = 'streaming'
    _error!.value = null
    _images!.value = []

    _abortController = new AbortController()

    try {
      const result: any = await $fetch('/api/image', {
        method: 'POST',
        signal: _abortController.signal,
        body: {
          type: 'image',
          task: options.task,
          prompt,
          messages: options.messages,
          model: options.model,
          imageModel: options.imageModel,
          imageSize: options.imageSize,
          n: options.n,
        },
      })

      if (result.sync) {
        _images!.value = result.images || []
        _status!.value = 'idle'
        return
      }

      if (result.taskId) {
        await pollTask(result.taskId)
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        _status!.value = 'idle'
        return
      }
      _error!.value = err.data?.statusMessage || err.message || '图片生成失败'
      _status!.value = 'error'
    }
  }

  async function pollTask(taskId: string) {
    const MAX_POLL = 120
    let attempts = 0

    while (attempts < MAX_POLL) {
      if (_abortController?.signal.aborted) return

      await new Promise((resolve) => setTimeout(resolve, 2000))

      try {
        const result: any = await $fetch(`/api/image/status?id=${taskId}`, {
          signal: _abortController?.signal,
        })

        if (result.status === 'succeeded') {
          _images!.value = result.images || []
          _status!.value = 'idle'
          return
        }

        if (result.status === 'failed') {
          _error!.value = result.error || '异步任务失败'
          _status!.value = 'error'
          return
        }
      } catch (err: any) {
        if (err.name === 'AbortError') return
        // 继续轮询
      }

      attempts++
    }

    _error!.value = '任务超时'
    _status!.value = 'error'
  }

  function stop() {
    if (_abortController) {
      _abortController.abort()
      _abortController = null
    }
    if (_pollTimer) {
      clearInterval(_pollTimer)
      _pollTimer = null
    }
    if (_status?.value === 'streaming') {
      _status.value = 'idle'
    }
  }

  function reset() {
    stop()
    _images!.value = []
    _error!.value = null
    _status!.value = 'idle'
  }

  return {
    status: _status,
    images: _images,
    error: _error,
    generate,
    stop,
    reset,
  }
}
