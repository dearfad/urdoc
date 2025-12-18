export async function onRequest({ request }) {
  const { imgUrl } = await request.json()
  const result = await fetch(imgUrl)
  const buffer = await result.arrayBuffer()
  const base64 =
    `data:${result.headers.get('content-type')};base64,` + Buffer.from(buffer).toString('base64')
  return new Response(base64)
}
