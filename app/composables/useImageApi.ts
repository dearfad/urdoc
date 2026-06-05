let _status: ReturnType<typeof ref<string>> | null = null
let _error: ReturnType<typeof ref<string | null>> | null = null
let _abortController: AbortController | null = null

export function useImageApi() {
  if (!_status) _status = ref<'idle' | 'streaming' | 'error'>('idle')
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
  ): Promise<{ images: { url: string }[]; originalUrls: string[] } | null> {
    stop()
    _status!.value = 'streaming'
    _error!.value = null

    _abortController = new AbortController()

    try {
      const endpoint = '/api/agnes/image'

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

      const images = (result.images || []).map((img: any) => ({
        url: `data:${img.mediaType};base64,${img.base64}`,
      }))
      const originalUrls: string[] = result.originalUrls || []

      _status!.value = 'idle'

      return { images, originalUrls }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        _status!.value = 'idle'
        return null
      }
      _error!.value = err.data?.statusMessage || err.message || '图片生成失败'
      _status!.value = 'error'
      return null
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
    _error!.value = null
    _status!.value = 'idle'
  }

  return {
    status: _status,
    error: _error,
    generate,
    stop,
    reset,
  }
}
