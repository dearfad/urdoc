import { DefaultChatTransport } from 'ai'
import { Chat } from '@ai-sdk/vue'

let _synthesizeStatus: ReturnType<typeof ref<string>> | null = null
let _audioUrl: ReturnType<typeof ref<string | null>> | null = null
let _error: ReturnType<typeof ref<string | null>> | null = null
let _abortController: AbortController | null = null
let _pollTimer: ReturnType<typeof setTimeout> | null = null
let _taskId: string | null = null
let _model: { provider: string | null; name: string | null; apiKey: string | null; baseURL: string | null } | null = null

let chat: Chat | null = null
let _chatStatus: ReturnType<typeof computed<string>> | null = null

export function useAudioApi() {
  const stateStore = useStateStore()

  if (!_synthesizeStatus) _synthesizeStatus = ref<'idle' | 'loading' | 'error'>('idle')
  if (!_audioUrl) _audioUrl = ref<string | null>(null)
  if (!_error) _error = ref<string | null>(null)

  if (!chat) {
    chat = new Chat({
      transport: new DefaultChatTransport({ api: '/api/aisdk/text' }),
      onError: (error) => {
        stateStore.toast.add({
          title: '生成失败',
          description: error.message,
          color: 'error',
          icon: 'i-lucide-alert-circle',
        })
      },
    })
    _chatStatus = computed(() => (chat!.status === 'idle' ? 'ready' : chat!.status))
  }

  async function synthesize(text: string, model: any): Promise<{ url: string; base64?: string; mediaType?: string }> {
    if (_synthesizeStatus!.value === 'loading') return null as any
    _synthesizeStatus!.value = 'loading'
    _audioUrl!.value = null
    _error!.value = null

    _abortController = new AbortController()

    try {
      let result: { url: string; base64?: string; mediaType?: string }

      if (model.provider === 'XiaoMI') {
        const data: any = await $fetch('/api/xiaomi/audio', {
          method: 'POST',
          signal: _abortController.signal,
          body: { model, text },
        })
        result = {
          url: `data:${data.mediaType};base64,${data.base64}`,
          base64: data.base64,
          mediaType: data.mediaType,
        }
      } else {
        const { taskId } = await $fetch('/api/gitee/audio', {
          method: 'POST',
          signal: _abortController.signal,
          body: { task: 'create', model, input: text },
        })
        _taskId = taskId

        const timeout = 60000
        const start = Date.now()
        let url = ''

        while (true) {
          if (Date.now() - start > timeout) {
            throw new Error('语音合成超时')
          }

          const res = await $fetch('/api/gitee/audio', {
            method: 'POST',
            signal: _abortController!.signal,
            body: { task: 'query', taskId, model },
          })

          if (res.status === 'success') {
            url = res.file_url
            break
          }
          if (res.status === 'failure') {
            throw new Error('语音合成任务失败')
          }

          await new Promise((resolve) => {
            _pollTimer = setTimeout(resolve, 3000)
          })
        }

        result = { url }
      }

      _audioUrl!.value = result.url
      return result
    } catch (err: any) {
      if (err.name === 'AbortError') return null as any
      _error!.value = err.message || '语音合成失败'
      _synthesizeStatus!.value = 'error'
      throw err
    } finally {
      if (_synthesizeStatus!.value === 'loading') {
        _synthesizeStatus!.value = 'idle'
      }
    }
  }

  function sendGenerate(text: string, options: { type: string; task: string; [key: string]: any }) {
    if (chat!.status === 'error') chat!.clearError()
    chat!.stop()
    chat!.sendMessage({ text }, { body: { ...options } })
  }

  function stopGenerate() {
    chat?.stop()
  }

  function clearGenerateError() {
    if (chat?.status === 'error') chat?.clearError()
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
    if (_synthesizeStatus?.value === 'loading') {
      _synthesizeStatus.value = 'idle'
    }
  }

  function reset() {
    stop()
    _audioUrl!.value = null
    _error!.value = null
    _synthesizeStatus!.value = 'idle'
  }

  return {
    synthesizeStatus: _synthesizeStatus!,
    audioUrl: _audioUrl!,
    error: _error!,
    chatStatus: _chatStatus!,
    synthesize,
    sendGenerate,
    stopGenerate,
    clearGenerateError,
    stop,
    reset,
  }
}
