export default defineEventHandler(async () => {
  const commitMain = await $fetch('https://api.github.com/repos/dearfad/urdoc/commits/main', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_API_TOKEN}`,
    },
  })
  return commitMain.commit.committer.date
})
