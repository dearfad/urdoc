let _status: ReturnType<typeof ref<string>> | null = null
let _videoUrl: ReturnType<typeof ref<string | null>> | null = null
let _progress: ReturnType<typeof ref<number>> | null = null
let _error: ReturnType<typeof ref<string | null>> | null = null
let _taskId: string | null = null
let _pollTimer: ReturnType<typeof setTimeout> | null = null
let _abortController: AbortController | null = null
let _model: { provider: string | null; name: string | null; apiKey: string | null; baseURL: string | null } | null = null

export function useVideoApi() {
  if (!_status) _status = ref<'idle' | 'streaming' | 'error'>('idle')
  if (!_videoUrl) _videoUrl = ref<string | null>(null)
  if (!_progress) _progress = ref(0)
  if (!_error) _error = ref<string | null>(null)

  async function create(
    prompt: string,
    options: {
      model: { provider: string | null; name: string | null; apiKey: string | null; baseURL: string | null }
      image?: string
      num_frames?: number
      frame_rate?: number
      width?: number
      height?: number
      negative_prompt?: string
      seed?: number
    },
  ) {
    stop()
    _status!.value = 'streaming'
    _error!.value = null
    _videoUrl!.value = null
    _progress!.value = 0

    _abortController = new AbortController()

    try {
      const result: any = await $fetch('/api/agnes/video', {
        method: 'POST',
        signal: _abortController.signal,
        body: {
          task: 'create',
          model: options.model,
          prompt,
          image: options.image,
          num_frames: options.num_frames,
          frame_rate: options.frame_rate,
          width: options.width,
          height: options.height,
          negative_prompt: options.negative_prompt,
          seed: options.seed,
        },
      })

      _taskId = result.taskId
      _model = { ...options.model }
      await poll()
    } catch (err: any) {
      if (err.name === 'AbortError') {
        _status!.value = 'idle'
        return
      }
      _error!.value = err.data?.statusMessage || err.message || '视频生成失败'
      _status!.value = 'error'
    }
  }

  async function poll() {
    if (!_taskId) return

    while (_status!.value === 'streaming') {
      try {
        const result: any = await $fetch('/api/agnes/video', {
          method: 'POST',
          signal: _abortController?.signal,
          body: {
            task: 'query',
            model: _model,
            taskId: _taskId,
          },
        })

        _progress!.value = result.progress ?? 0

        if (result.status === 'completed') {
          _videoUrl!.value = result.video_url
          _status!.value = 'idle'
          return
        }

        if (result.status === 'failed') {
          _error!.value = '视频生成失败'
          _status!.value = 'error'
          return
        }

        await new Promise((resolve) => {
          _pollTimer = setTimeout(resolve, 5000)
        })
      } catch (err: any) {
        if (err.name === 'AbortError') {
          _status!.value = 'idle'
          return
        }
        _error!.value = err.data?.statusMessage || err.message || '查询视频状态失败'
        _status!.value = 'error'
        return
      }
    }
  }

  function stop() {
    if (_pollTimer) {
      clearTimeout(_pollTimer)
      _pollTimer = null
    }
    if (_abortController) {
      _abortController.abort()
      _abortController = null
    }
    _taskId = null
    _model = null
    if (_status?.value === 'streaming') {
      _status.value = 'idle'
    }
  }

  function reset() {
    stop()
    _videoUrl!.value = null
    _progress!.value = 0
    _error!.value = null
    _status!.value = 'idle'
    _model = null
  }

  return {
    status: _status,
    videoUrl: _videoUrl,
    progress: _progress,
    error: _error,
    create,
    stop,
    reset,
  }
}
