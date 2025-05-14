export default defineEventHandler(async () => {
  try {
    const commitMain = await $fetch('https://api.github.com/repos/dearfad/urdoc/commits/main', {
      method: 'GET',
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${process.env.GITHUB_API_TOKEN}`,
        'User-Agent': 'urdoc',
      },
    })
    return commitMain.commit.committer.date
  } catch (error) {
    return error
  }
})
