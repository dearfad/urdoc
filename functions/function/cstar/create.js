export async function onRequest({ request }) {
  const json = await request.clone().json()
  return new Response(JSON.stringify(json), {
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      'Access-Control-Allow-Origin': '*',
    },
  })
}
