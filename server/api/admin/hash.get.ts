export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const password = query.password as string

  if (!password) {
    throw createError({ statusCode: 400, message: '缺少 password 参数' })
  }

  const hash = await hashPassword(password)
  return { hash }
})
