export default defineEventHandler(async (event) => {
  const { imgUrl } = await readBody(event)
  const result = await fetch(imgUrl)
  const array = await result.arrayBuffer()
  const bytes = new Uint8Array(array)
  const binary = bytes.reduce((acc, byte) => acc + String.fromCharCode(byte), '')
  const base64 = `data:${result.headers.get('content-type')};base64,${btoa(binary)}`
  return base64
})
