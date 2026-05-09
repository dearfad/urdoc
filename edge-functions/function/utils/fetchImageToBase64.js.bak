export async function onRequest({ request }) {
  const { imgUrl } = await request.json()
  const result = await fetch(imgUrl)
  const array = await result.arrayBuffer()
  const bytes = new Uint8Array(array)
  const binary = bytes.reduce((acc, byte) => acc + String.fromCharCode(byte), '')
  const base64 = `data:${result.headers.get('content-type')};base64,${btoa(binary)}`
  return new Response(base64)
}
