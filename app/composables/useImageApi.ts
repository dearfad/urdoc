import { notifyError, normalizeErrorMessage } from '~/utils/error'

let _status = ref<'idle' | 'streaming' | 'error'>('idle')
let _error = ref<string | null>(null)
let _abortController: AbortController | null = null

export function useImageApi() {
  const modelStore = useModelStore()

  async function generate(
    prompt: string,
    options: {
      task?: string
      model: Model
      imageSize?: string
      n?: number
      image?: string
    },
  ): Promise<{ images: { url: string }[]; originalUrls: string[] } | null> {
    stop()
    _status.value = 'streaming'
    _error.value = null

    _abortController = new AbortController()

    const isComfyUI =
      options.model?.provider === 'Custom' &&
      String(options.model?.name ?? '').trim().toLowerCase() === 'comfyui'
    // 故事插图走图像编辑模板，其余任务走文生图模板；非本地 ComfyUI 模型传空值
    const template = isComfyUI
      ? options.task === 'illustration'
        ? (modelStore.customModels.image.editTemplate ?? 'qwen-image-2.1-turbo-edit')
        : (modelStore.customModels.image.t2iTemplate ?? 'z-image-turbo')
      : ''

    try {
      const result: any = await $fetch('/api/image', {
        method: 'POST',
        signal: _abortController.signal,
        body: {
          prompt,
          model: options.model,
          n: options.n,
          size: options.imageSize,
          image: options.image,
          task: options.task,
          template,
        },
      })

      const images = (result.images || []).map((img: any) => ({
        url: `data:${img.mediaType};base64,${img.base64}`,
      }))
      const originalUrls: string[] = result.originalUrls || []

      _status.value = 'idle'

      return { images, originalUrls }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        _status.value = 'idle'
        return null
      }
      _error.value = normalizeErrorMessage(err)
      notifyError(err, '图片生成失败')
      _status.value = 'error'
      return null
    }
  }

  function stop() {
    if (_abortController) {
      _abortController.abort()
      _abortController = null
    }
    if (_status.value === 'streaming') {
      _status.value = 'idle'
    }
  }

  function reset() {
    stop()
    _error.value = null
    _status.value = 'idle'
  }

  return {
    status: _status,
    error: _error,
    generate,
    stop,
    reset,
  }
}
