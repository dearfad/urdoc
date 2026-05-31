import { DefaultChatTransport, isReasoningUIPart } from 'ai'
import { Chat } from '@ai-sdk/vue'

export function useChatGenerations() {
  const stateStore = useStateStore()

  const chat = new Chat({
    transport: new DefaultChatTransport({
      api: stateStore.apiBaseUrl,
    }),
    onError: (error) => {
      stateStore.toast.add({
        title: '生成失败',
        description: error.message,
        color: 'error',
        icon: 'i-lucide-alert-circle',
      })
    },
  })

  const status = computed(() => chat.status)

  const currentOnPart = ref<((part: any) => void) | null>(null)
  const currentType = ref('')

  watch(
    () => chat.lastMessage?.parts,
    (parts) => {
      if (!parts) return
      for (const part of parts.slice(1)) {
        stateStore[currentType.value].isReasoning = isReasoningUIPart(part)
        currentOnPart.value?.(part)
      }
    },
    { deep: true },
  )

  function send({
    type,
    task = 'generate',
    text,
    body,
    onPart,
  }: {
    type: string
    task?: string
    text: string
    body?: Record<string, unknown>
    onPart?: (part: any) => void
  }) {
    if (chat.status === 'error') chat.clearError()
    chat.stop()
    currentOnPart.value = onPart ?? null
    currentType.value = type
    chat.sendMessage({ text }, { body: { ...body, type, task } })
  }

  function stop() {
    chat.stop()
  }

  return { status, send, stop }
}
