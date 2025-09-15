/**
 * 获取指定分支最后一次提交的日期
 * @param {Object} context - 请求上下文对象
 * @param {Request} context.request - HTTP请求对象，包含请求体等信息
 * @param {Object} context.env - 环境变量对象，包含GITHUB_API_TOKEN等配置
 * @returns {Response} 返回包含最后一次提交日期的HTTP响应对象
 */
export async function onRequest({ request, env }) {
  // 解析请求体，获取分支名称
  const { branch } = await request.json()

  // 构造GitHub API请求URL
  const githubApiUrl = `https://api.github.com/repos/dearfad/urdoc/commits/${branch}`

  // 调用GitHub API获取指定分支的提交信息
  const response = await fetch(githubApiUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/vnd.github+json',
      'User-Agent': 'urdoc',
      Authorization: `Bearer ${env['GITHUB_API_TOKEN']}`,
    },
  })

  // 解析API响应数据
  const responseJson = await response.json()

  // 将UTC时间转换为北京时间
  const utcDate = new Date(responseJson.commit.committer.date)
  const beijingDateStr = utcDate.toLocaleDateString('zh-CN', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })

  // 格式化日期字符串，将斜杠替换为短横线
  const lastCommitDate = beijingDateStr.replace(/\//g, '-')

  // 返回格式化后的日期作为响应
  return new Response(lastCommitDate)
}
