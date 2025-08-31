export default defineEventHandler(async (event) => {
  const { branch } = await readBody(event)
  const githubApiUrl = `https://api.github.com/repos/dearfad/urdoc/commits/${branch}`
  const response = await fetch(githubApiUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/vnd.github+json',
      'User-Agent': 'urdoc',
      Authorization: `Bearer ${process.env['GITHUB_API_TOKEN']}`,
    },
  })
  const responseJson = await response.json()
  const utcDate = new Date(responseJson.commit.committer.date)
  const beijingDateStr = utcDate.toLocaleDateString('zh-CN', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
  const lastCommitDate = beijingDateStr.replace(/\//g, '-')
  return lastCommitDate
})
