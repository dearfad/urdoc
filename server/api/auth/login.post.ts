import { createClient } from '@libsql/client'

export default defineEventHandler(async (event) => {
  const { name, password } = await readBody(event)

  if (!name || !password) {
    throw createError({
      statusCode: 400,
      message: '请输入用户名和密码',
    })
  }

  // 获取 Turso 配置
  const config = useRuntimeConfig()
  const turso = createClient({
    url: config.turso.databaseUrl,
    authToken: config.turso.authToken,
  })

  // 查询用户
  const result = await turso.execute({
    sql: 'SELECT * FROM users WHERE name = ?',
    args: [name],
  })

  if (result.rows.length === 0) {
    throw createError({
      statusCode: 401,
      message: '用户名或密码错误',
    })
  }

  const user = result.rows[0]

  // 验证密码
  const isValid = await verifyPassword(user.password_hash as string, password)

  if (!isValid) {
    throw createError({
      statusCode: 401,
      message: '用户名或密码错误',
    })
  }

  // 设置会话
  await setUserSession(event, {
    user: {
      id: user.id,
      name: user.name,
    },
  })

  return { success: true }
})
