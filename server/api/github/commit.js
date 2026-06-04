export default defineEventHandler(async (event) => {
  const { branch } = await readBody(event)
  const config = useRuntimeConfig()

  const githubApiUrl = `https://api.github.com/repos/dearfad/urdoc/commits/${branch}`

  const response = await fetch(githubApiUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/vnd.github+json',
      'User-Agent': 'urdoc',
      Authorization: `Bearer ${config.githubApiToken}`,
    },
  })

  return response
})
