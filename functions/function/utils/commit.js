export async function onRequest({ env }) {
  try {
    const commitMain = await fetch('https://api.github.com/repos/dearfad/urdoc/commits/main', {
      method: 'GET',
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${env.GITHUB_API_TOKEN}`,
        'User-Agent': 'urdoc',
      },
    })
    const commitMainJson = await commitMain.json()
    const commitDate = commitMainJson.commit.committer.date
    return new Response(commitDate, {
      headers: {
        'Content-Type': 'text/plain',
      },
    })
  } catch (error) {
    return new Response(error.message, {
      headers: {
        'Content-Type': 'text/plain',
      },
    })
  }
}
