import type { ServiceStatus } from '../../app/types/github'

// 与 useModelStore().activeModels 的 apiKey 字段及 GitHub 接口使用的键名一一对应
const KEY_NAMES = [
  'shushengApiKey',
  'zhipuApiKey',
  'openrouterApiKey',
  'longcatApiKey',
  'agnesApiKey',
  'giteeApiKey',
  'xiaomiApiKey',
  'makersModelsKey',
  'githubApiToken',
] as const

export default defineCachedEventHandler(
  () => {
    const config = useRuntimeConfig() as Record<string, unknown>
    const configured: Record<string, boolean> = {}

    for (const key of KEY_NAMES) {
      const value = config[key]
      configured[key] = typeof value === 'string' && value.trim().length > 0
    }

    const status: ServiceStatus = {
      configured,
      checkedAt: new Date().toISOString(),
    }
    return status
  },
  {
    maxAge: 60,
    swr: true,
    name: 'service-status',
    getKey: () => 'status',
  },
)
