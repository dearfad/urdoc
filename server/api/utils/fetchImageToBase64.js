export default defineEventHandler(async (event) => {
  const { imgUrl } = await readBody(event)
  const result = await fetch(imgUrl)
  const buffer = await result.arrayBuffer()
  const base64 =
    `data:${result.headers.get('content-type')};base64,` + Buffer.from(buffer).toString('base64')
  return base64
})
