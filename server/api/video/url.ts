export default defineEventHandler(async (event) => {
  const { params } = await readBody(event)
  return await $fetch(`https://open.bigmodel.cn/api/paas/v4/async-result/${params.id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + process.env.ZHIPU_API_KEY,
    },
  })
})
