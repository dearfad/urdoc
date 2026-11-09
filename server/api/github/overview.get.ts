import type {
  BranchCompare,
  BranchName,
  BranchSummary,
  CommitAuthor,
  GithubOverview,
  TimelineCommit,
} from '../../../app/types/github'

const REPO = 'dearfad/urdoc'
const REPO_URL = `https://github.com/${REPO}`
const BRANCHES: BranchName[] = ['main', 'develop']
const SITE_URLS: Record<BranchName, string> = {
  main: 'https://urdoc.dearfad.com',
  develop: 'https://dev.urdoc.dearfad.com',
}
const PER_BRANCH_LIMIT = 6
const TIMELINE_LIMIT = 4
const CONTRIBUTOR_LIMIT = 6
const REQUEST_TIMEOUT = 8000

interface GithubUser {
  login?: string
  avatar_url?: string
}

interface GithubCommit {
  sha: string
  html_url?: string
  commit?: {
    message?: string
    author?: { name?: string; date?: string }
    committer?: { date?: string }
  }
  author?: GithubUser | null
  stats?: { additions?: number; deletions?: number; total?: number }
  files?: unknown[]
}

interface GithubCompare {
  ahead_by?: number
  behind_by?: number
  status?: string
}

async function githubRequest<T>(path: string, token: string): Promise<T> {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'urdoc',
    'X-GitHub-Api-Version': '2022-11-28',
  }
  // 公开仓库在未配置 token 时仍可匿名读取，避免空的 Bearer 头导致 401
  if (token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(`https://api.github.com/repos/${REPO}/${path}`, {
    headers,
    signal: AbortSignal.timeout(REQUEST_TIMEOUT),
  })
  if (!res.ok) {
    // 仅记录状态码，不打印 token、不把 GitHub 原始错误体回传前端
    console.error(`[github] ${path} HTTP ${res.status}`)
    throw new Error(`GitHub API ${res.status}`)
  }
  return (await res.json()) as T
}

function firstLine(message?: string): string {
  return (message ?? '').split('\n')[0]?.trim() ?? ''
}

function commitDate(commit: GithubCommit): string {
  return commit.commit?.committer?.date ?? commit.commit?.author?.date ?? ''
}

function toAuthor(commit: GithubCommit): CommitAuthor | null {
  const name = commit.author?.login || commit.commit?.author?.name || ''
  if (!name) return null
  return { name, avatarUrl: commit.author?.avatar_url ?? null }
}

function toBranchSummary(branch: BranchName, commit: GithubCommit): BranchSummary {
  const hasStats = Boolean(commit.stats || commit.files?.length)
  return {
    branch,
    sha: commit.sha ?? '',
    message: firstLine(commit.commit?.message),
    date: commitDate(commit),
    author: toAuthor(commit),
    stats: hasStats
      ? {
          files: commit.files?.length ?? commit.stats?.total ?? 0,
          additions: commit.stats?.additions ?? 0,
          deletions: commit.stats?.deletions ?? 0,
        }
      : null,
    htmlUrl: commit.html_url ?? `${REPO_URL}/commits/${branch}`,
    siteUrl: SITE_URLS[branch],
  }
}

function emptyBranch(branch: BranchName): BranchSummary {
  return {
    branch,
    sha: '',
    message: '',
    date: '',
    author: null,
    stats: null,
    htmlUrl: `${REPO_URL}/commits/${branch}`,
    siteUrl: SITE_URLS[branch],
    error: 'unavailable',
  }
}

function buildTimeline(listResults: PromiseSettledResult<GithubCommit[]>[]): TimelineCommit[] {
  const items = new Map<string, TimelineCommit>()

  BRANCHES.forEach((branch, index) => {
    const result = listResults[index]
    if (!result || result.status !== 'fulfilled') return

    for (const commit of result.value) {
      const existing = items.get(commit.sha)
      if (existing) {
        if (!existing.branches.includes(branch)) existing.branches.push(branch)
        continue
      }
      items.set(commit.sha, {
        sha: commit.sha,
        message: firstLine(commit.commit?.message),
        date: commitDate(commit),
        branch,
        branches: [branch],
        author: toAuthor(commit),
        htmlUrl: commit.html_url ?? `${REPO_URL}/commit/${commit.sha}`,
      })
    }
  })

  return [...items.values()]
    .sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
    .slice(0, TIMELINE_LIMIT)
}

function collectContributors(branches: BranchSummary[], timeline: TimelineCommit[]): CommitAuthor[] {
  const seen = new Set<string>()
  const result: CommitAuthor[] = []
  const authors = [...branches.map((item) => item.author), ...timeline.map((item) => item.author)]

  for (const author of authors) {
    if (!author || seen.has(author.name)) continue
    seen.add(author.name)
    result.push(author)
    if (result.length >= CONTRIBUTOR_LIMIT) break
  }
  return result
}

export default defineCachedEventHandler(
  async () => {
    const token = String(useRuntimeConfig().githubApiToken ?? '').trim()

    // 五个请求完全并行，任一路失败只标记该区块，其余数据照常返回
    const [details, lists, comparison] = await Promise.all([
      Promise.allSettled(BRANCHES.map((branch) => githubRequest<GithubCommit>(`commits/${branch}`, token))),
      Promise.allSettled(
        BRANCHES.map((branch) =>
          githubRequest<GithubCommit[]>(`commits?sha=${branch}&per_page=${PER_BRANCH_LIMIT}`, token),
        ),
      ),
      githubRequest<GithubCompare>('compare/main...develop', token)
        .then((value) => ({ ok: true as const, value }))
        .catch(() => ({ ok: false as const })),
    ])

    const warnings: string[] = []
    const branches = BRANCHES.map((branch, index) => {
      const result = details[index]
      if (result && result.status === 'fulfilled') return toBranchSummary(branch, result.value)
      warnings.push(`detail:${branch}`)
      return emptyBranch(branch)
    })

    BRANCHES.forEach((branch, index) => {
      if (lists[index]?.status !== 'fulfilled') warnings.push(`list:${branch}`)
    })

    let compare: BranchCompare | null = null
    if ('value' in comparison) {
      compare = {
        aheadBy: comparison.value.ahead_by ?? 0,
        behindBy: comparison.value.behind_by ?? 0,
        status: comparison.value.status ?? 'unknown',
      }
    } else {
      warnings.push('compare')
    }

    const timeline = buildTimeline(lists)
    const overview: GithubOverview = {
      branches,
      compare,
      timeline,
      contributors: collectContributors(branches, timeline),
      warnings,
      fetchedAt: new Date().toISOString(),
    }
    return overview
  },
  {
    maxAge: 90,
    swr: true,
    name: 'github-overview',
    // 手动刷新使用分钟级缓存键，强制取回新数据且不会无限积累缓存条目
    getKey: (event) =>
      getQuery(event).refresh === '1' ? `overview:force:${Math.floor(Date.now() / 60_000)}` : 'overview',
  },
)
