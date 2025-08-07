export function onRequest(context) {
  return new Response(JSON.stringify(context), {
    headers: { 'Content-Type': 'application/json' },
  })
}
