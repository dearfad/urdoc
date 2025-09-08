export async function onRequest({ request, env }) {
  return new Response(JSON.stringify(request))
}
