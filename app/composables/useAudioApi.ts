import { DefaultChatTransport, type UIMessage } from 'ai'
import { Chat } from '@ai-sdk/vue'
import type { ComputedRef } from 'vue'

let _synthesizeStatus = ref<'idle' | 'loading' | 'error'>('idle')
let _audioUrl = ref<string | null>(null)
let _error = ref<string | null>(null)
let _abortController: AbortController | null = null
let _pollTimer: ReturnType<typeof setTimeout> | null = null
let _taskId: string | null = null

let chat: Chat<UIMessage> | null = null
let _chatStatus: ComputedRef<string>

export function useAudioApi() {
  const stateStore = useStateStore()

  if (!chat) {
    chat = new Chat({
      transport: new DefaultChatTransport({ api: '/api/chat' }),
      onError: (error) => {
        stateStore.toast.add({
          title: '生成失败',
          description: error.message,
          color: 'error',
          icon: 'i-lucide-alert-circle',
        })
      },
    })
    _chatStatus = computed(() => chat!.status)
  }

  async function synthesize(text: string, model: any): Promise<{ url: string; base64?: string; mediaType?: string }> {
    if (_synthesizeStatus.value === 'loading') return null as any
    _synthesizeStatus.value = 'loading'
    _audioUrl.value = null
    _error.value = null

    _abortController = new AbortController()

    try {
      const data: any = await $fetch('/api/audio', {
        method: 'POST',
        signal: _abortController.signal,
        body: { model, text },
      })

      if (data.base64) {
        const url = `data:${data.mediaType};base64,${data.base64}`
        _audioUrl.value = url
        return { url, base64: data.base64, mediaType: data.mediaType }
      }

      if (data.taskId) {
        _taskId = data.taskId
        const url = await pollAudio(data.taskId, model)
        _audioUrl.value = url
        return { url }
      }

      throw new Error('不支持的响应格式')
    } catch (err: any) {
      if (err.name === 'AbortError') return null as any
      _error.value = err.message || '语音合成失败'
      _synthesizeStatus.value = 'error'
      throw err
    } finally {
      if (_synthesizeStatus.value === 'loading') {
        _synthesizeStatus.value = 'idle'
      }
    }
  }

  async function pollAudio(taskId: string, model: any): Promise<string> {
    const timeout = 60000
    const start = Date.now()

    while (true) {
      if (Date.now() - start > timeout) {
        throw new Error('语音合成超时')
      }

      const res: any = await $fetch('/api/audio', {
        method: 'POST',
        signal: _abortController!.signal,
        body: { task: 'query', taskId, model },
      })

      if (res.status === 'success') {
        return res.file_url
      }
      if (res.status === 'failure') {
        throw new Error('语音合成任务失败')
      }

      await new Promise((resolve) => {
        _pollTimer = setTimeout(resolve, 3000)
      })
    }
  }

  function sendGenerate(text: string, options: { type: string; task: string; [key: string]: any }) {
    if (chat!.status === 'error') chat!.clearError()
    chat!.stop()
    chat!.sendMessage({ text }, { body: { ...options } })
  }

  function stopGenerate() { chat?.stop() }
  function clearGenerateError() { if (chat?.status === 'error') chat?.clearError() }

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
    if (_synthesizeStatus.value === 'loading') {
      _synthesizeStatus.value = 'idle'
    }
  }

  function reset() {
    stop()
    _audioUrl.value = null
    _error.value = null
    _synthesizeStatus.value = 'idle'
  }

  return {
    synthesizeStatus: _synthesizeStatus,
    audioUrl: _audioUrl,
    error: _error,
    chatStatus: _chatStatus,
    synthesize,
    sendGenerate,
    stopGenerate,
    clearGenerateError,
    stop,
    reset,
  }
}
