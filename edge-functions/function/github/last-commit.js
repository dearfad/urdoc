export async function onRequest({ request, env }) {
  const { branch } = await request.json()
  const githubApiUrl = `https://api.github.com/repos/dearfad/urdoc/commits/${branch}`

  const response = await fetch(githubApiUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/vnd.github+json',
      'User-Agent': 'urdoc',
      Authorization: `Bearer ${env['GITHUB_API_TOKEN']}`,
    },
  })

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
