let _status: ReturnType<typeof ref<string>> | null = null
let _images: ReturnType<typeof ref<{ url: string }[]>> | null = null
let _error: ReturnType<typeof ref<string | null>> | null = null
let _abortController: AbortController | null = null

export function useImageApi() {
  if (!_status) _status = ref<'idle' | 'streaming' | 'error'>('idle')
  if (!_images) _images = ref<{ url: string }[]>([])
  if (!_error) _error = ref<string | null>(null)

  async function generate(
    prompt: string,
    options: {
      task?: string
      system?: string
      model: { provider: string | null; name: string | null; apiKey: string | null; baseURL: string | null }
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
      const endpoint = options.model.provider === 'Agnes'
        ? '/api/agnes/image'
        : '/api/aisdk/image'

      const result: any = await $fetch(endpoint, {
        method: 'POST',
        signal: _abortController.signal,
        body: {
          prompt,
          model: options.model,
          n: options.n,
          size: options.imageSize,
        },
      })

      _images!.value = (result.images || []).map((img: any) => ({
        url: `data:${img.mediaType};base64,${img.base64}`,
      }))
      _status!.value = 'idle'
    } catch (err: any) {
      if (err.name === 'AbortError') {
        _status!.value = 'idle'
        return
      }
      _error!.value = err.data?.statusMessage || err.message || '图片生成失败'
      _status!.value = 'error'
    }
  }

  function stop() {
    if (_abortController) {
      _abortController.abort()
      _abortController = null
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
