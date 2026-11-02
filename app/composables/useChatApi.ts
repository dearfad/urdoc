import { DefaultChatTransport, type UIMessage } from 'ai'
import { Chat } from '@ai-sdk/vue'
import type { ComputedRef } from 'vue'
import { notifyError } from '~/utils/error'

let chat: Chat<UIMessage> | null = null
let _status: ComputedRef<string>
let _lastParts: ComputedRef<any[]>
let _lastMessageRole: ComputedRef<string | null>
const _currentType = ref<string | null>(null)

export function useChatApi() {
  if (!chat) {
    chat = new Chat({
      transport: new DefaultChatTransport({ api: '/api/chat' }),
      onError: (error) => notifyError(error, '生成失败'),
    })

    _status = computed(() => chat!.status)
    _lastParts = computed(() => [...(chat!.lastMessage?.parts ?? [])])
    _lastMessageRole = computed(() => chat!.lastMessage?.role ?? null)
  }

  function send(text: string, options: { type: string; task: string; [key: string]: any }) {
    _currentType.value = options.type
    if (chat!.status === 'error') chat!.clearError()
    chat!.stop()
    chat!.sendMessage({ text }, { body: { ...options } })
  }

  function stop() { chat?.stop() }
  function clearError() { if (chat?.status === 'error') chat?.clearError() }
  function regenerate() { chat?.regenerate() }

  return {
    status: _status,
    lastParts: _lastParts,
    lastMessageRole: _lastMessageRole,
    currentType: _currentType,
    send,
    stop,
    clearError,
    regenerate,
  }
}
