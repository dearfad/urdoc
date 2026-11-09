// GitHub 仓库动态与配置状态在服务端接口、composable、看板组件之间共用的响应契约

export type BranchName = 'main' | 'develop'

// 提交作者，头像为 GitHub 外链地址，可能缺失
export interface CommitAuthor {
  name: string
  avatarUrl: string | null
}

// 单次提交的代码变更统计
export interface CommitStats {
  files: number
  additions: number
  deletions: number
}

// 分支最新提交概览，error 存在时表示该分支数据获取失败，其余字段为空值
export interface BranchSummary {
  branch: BranchName
  sha: string
  message: string
  date: string
  author: CommitAuthor | null
  stats: CommitStats | null
  htmlUrl: string
  siteUrl: string
  error?: string
}

// 时间线条目，branch 为主标记，branches 列出该提交出现过的所有分支
export interface TimelineCommit {
  sha: string
  message: string
  date: string
  branch: BranchName
  branches: BranchName[]
  author: CommitAuthor | null
  htmlUrl: string
}

// compare/main...develop 的分支差异，aheadBy 为 develop 领先数、behindBy 为落后数
export interface BranchCompare {
  aheadBy: number
  behindBy: number
  status: string
}

export interface GithubOverview {
  branches: BranchSummary[]
  compare: BranchCompare | null
  timeline: TimelineCommit[]
  contributors: CommitAuthor[]
  // 局部失败的区块标记，例如 'detail:main'、'list:develop'、'compare'
  warnings: string[]
  fetchedAt: string
}

// 仅反映服务端 runtimeConfig 中各项密钥是否已配置，绝不返回密钥内容
export interface ServiceStatus {
  configured: Record<string, boolean>
  checkedAt: string
}
