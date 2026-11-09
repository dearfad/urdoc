// 分支白名单，避免外部入参直接拼入 GitHub API 路径
const ALLOWED_BRANCHES = new Set(['main', 'develop'])

export default defineEventHandler(async (event) => {
  const { branch } = await readBody(event)
  if (!ALLOWED_BRANCHES.has(branch)) {
    throw createError({ statusCode: 400, message: 'Unsupported branch' })
  }
  const config = useRuntimeConfig()
  const headers = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'urdoc',
  }
  // 公开仓库在未配置 token 时仍可匿名读取
  if (config.githubApiToken) headers.Authorization = `Bearer ${config.githubApiToken}`

  const res = await fetch(
    `https://api.github.com/repos/dearfad/urdoc/commits/${branch}`,
    { headers, signal: AbortSignal.timeout(8000) },
  )

  if (!res.ok) {
    console.error(`[github] commits/${branch} HTTP ${res.status}`)
    throw createError({
      statusCode: 502,
      message: `GitHub API ${res.status}`,
    })
  }

  const { commit } = await res.json()
  return new Date(commit.committer.date)
    .toLocaleDateString('zh-CN', { timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit' })
    .replace(/\//g, '-')
})
