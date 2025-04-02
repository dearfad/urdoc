export async function onRequest(context) {
  return new Response(JSON.stringify(context), {
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      'Access-Control-Allow-Origin': '*',
    },
  })
}
