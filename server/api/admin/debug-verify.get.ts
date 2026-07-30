import { createClient } from '@libsql/client/http'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const name = query.name as string
  const password = query.password as string

  if (!name || !password) {
    throw createError({ statusCode: 400, message: '缺少 name 或 password 参数' })
  }

  const config = useRuntimeConfig()
  const turso = createClient({
    url: config.turso.databaseUrl,
    authToken: config.turso.authToken,
  })

  const result = await turso.execute({
    sql: 'SELECT * FROM users WHERE name = ?',
    args: [name],
  })

  if (result.rows.length === 0) {
    return { error: '用户不存在', name }
  }

  const user = result.rows[0]
  const hash = user.password_hash as string

  // 检查哈希格式
  const hashInfo = {
    starts_with_dollar: hash.startsWith('$'),
    first_80_chars: hash.substring(0, 80),
    length: hash.length,
    has_trailing_whitespace: hash !== hash.trimEnd(),
    ends_with_newline: hash.endsWith('\n') || hash.endsWith('\r'),
  }

  try {
    const isValid = await verifyPassword(hash, password)

    // 如果验证失败，尝试用当前密码生成新哈希再验证
    let rehashTest = null
    if (!isValid) {
      const newHash = await hashPassword(password)
      const rehashValid = await verifyPassword(newHash, password)
      rehashTest = {
        newHash_first_80: newHash.substring(0, 80),
        newHash_length: newHash.length,
        rehashValid,
      }
    }

    return {
      name,
      password_length: password.length,
      hashInfo,
      isValid,
      rehashTest,
    }
  }
  catch (e: any) {
    return {
      error: e.message,
      hashInfo,
    }
  }
})
