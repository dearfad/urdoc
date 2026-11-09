import type { GithubOverview } from '~/types/github'

const MINUTE = 60_000
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR
const MONTH = 30 * DAY
const YEAR = 365 * DAY

// 把 ISO 时间转为「几分钟前」等本地化相对时间，避免为每种时间单位新增文案
export function formatRelativeTime(date: string, locale: string): string {
  const timestamp = Date.parse(date)
  if (!Number.isFinite(timestamp)) return ''

  const diff = timestamp - Date.now()
  const abs = Math.abs(diff)
  const rtf = new Intl.RelativeTimeFormat(locale.startsWith('zh') ? 'zh-CN' : 'en', { numeric: 'auto' })

  if (abs < MINUTE) return rtf.format(Math.round(diff / 1000), 'second')
  if (abs < HOUR) return rtf.format(Math.round(diff / MINUTE), 'minute')
  if (abs < DAY) return rtf.format(Math.round(diff / HOUR), 'hour')
  if (abs < MONTH) return rtf.format(Math.round(diff / DAY), 'day')
  if (abs < YEAR) return rtf.format(Math.round(diff / MONTH), 'month')
  return rtf.format(Math.round(diff / YEAR), 'year')
}

// 统一按东八区展示完整更新时间
export function formatDateTime(date: string, locale: string): string {
  const timestamp = Date.parse(date)
  if (!Number.isFinite(timestamp)) return '--'

  return new Intl.DateTimeFormat(locale.startsWith('zh') ? 'zh-CN' : 'en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Shanghai',
  }).format(timestamp)
}

export function useGithubOverview() {
  const query = ref<Record<string, string>>({})

  // 仅在客户端异步拉取，首屏由骨架屏占位，不阻塞页面渲染
  const { data, pending, error } = useFetch<GithubOverview>('/api/github/overview', {
    key: 'github-overview',
    query,
    server: false,
    lazy: true,
    default: () => null,
  })

  let sequence = 0

  // 刷新时携带 refresh=1 让服务端绕过常规缓存；query 变化由 useFetch 自动触发重取
  function refresh() {
    if (pending.value) return
    sequence += 1
    query.value = { refresh: '1', t: String(sequence) }
  }

  return { data, pending, error, refresh }
}
