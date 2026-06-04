export default defineEventHandler(async (event) => {
  const { branch } = await readBody(event)
  const config = useRuntimeConfig()

  const res = await fetch(
    `https://api.github.com/repos/dearfad/urdoc/commits/${branch}`,
    {
      headers: {
        Accept: 'application/vnd.github+json',
        'User-Agent': 'urdoc',
        Authorization: `Bearer ${config.githubApiToken}`,
      },
    },
  )

  if (!res.ok) {
    throw createError({
      statusCode: 502,
      message: `GitHub API ${res.status}: ${await res.text()}`,
    })
  }

  const { commit } = await res.json()
  return new Date(commit.committer.date)
    .toLocaleDateString('zh-CN', { timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit' })
    .replace(/\//g, '-')
})
