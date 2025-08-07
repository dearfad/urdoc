export async function onRequest({ request, env }) {
  const { params } = await request.json()
  const response = await fetch(`https://open.bigmodel.cn/api/paas/v4/async-result/${params.id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + env['ZHIPU_API_KEY'],
    },
  })
  return new Response(response.body, {
    headers: {
      'content-type': 'application/json; charset=UTF-8',
      'Access-Control-Allow-Origin': '*',
    },
  })
}
