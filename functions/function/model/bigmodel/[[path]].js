export async function onRequest({ request, env }) {
  const { pathname } = new URL(request.url)
  return new Response(JSON.stringify(pathname))
}
