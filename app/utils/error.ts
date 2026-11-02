import { useStateStore } from '~/stores/state'

// 从各类错误对象中提取可读的错误信息
export function normalizeErrorMessage(err: any): string {
  if (!err) return '未知错误'

  // Nitro 错误响应体（fetch 抛出的 err.data）
  if (err.data?.message) return err.data.message
  if (err.data?.statusMessage && err.data.statusMessage !== 'Server Error') {
    return err.data.statusMessage
  }

  let msg = err.message || String(err)

  // 流式请求失败时，DefaultChatTransport 可能把整个 JSON 响应体作为 message
  if (typeof msg === 'string' && msg.trim().startsWith('{')) {
    try {
      const parsed = JSON.parse(msg)
      if (parsed?.message) msg = parsed.message
    } catch {
      // 解析失败则保留原始文本
    }
  }

  // 去掉 AI SDK 的重试包装前缀：Failed after N attempts. Last error: ...
  const retryPrefix = /^Failed after \d+ attempts\. Last error:\s*/
  if (retryPrefix.test(msg)) {
    msg = msg.replace(retryPrefix, '')
  }

  return msg
}

// 统一的错误 toast 提示
export function notifyError(err: any, title = '操作失败') {
  const message = normalizeErrorMessage(err)

  // 针对速率限制给出更友好的引导
  if (/速率限制|rate limit|429/i.test(message)) {
    title = '请求过于频繁'
  }

  const stateStore = useStateStore()
  stateStore.toast.add({
    title,
    description: message,
    color: 'error',
    icon: 'i-lucide-alert-circle',
    duration: 6000,
  })
}
