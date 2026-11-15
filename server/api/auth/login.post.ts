import { z } from 'zod'
import { createClient } from '@libsql/client/http'

// 按角色分流的登录请求校验
const loginSchema = z.discriminatedUnion('role', [
  z.object({
    role: z.literal('student'),
    name: z.string().min(1, '请输入姓名'),
    studentNo: z.string().min(1, '请输入学号'),
  }),
  z.object({
    role: z.literal('teacher'),
    account: z.string().min(1, '请输入账号'),
    password: z.string().min(1, '请输入密码'),
  }),
  z.object({
    role: z.literal('admin'),
    account: z.string().min(1, '请输入账号'),
    password: z.string().min(1, '请输入密码'),
  }),
])

export default defineEventHandler(async (event) => {
  const parsed = loginSchema.safeParse(await readBody(event))
  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      message: parsed.error.issues[0]?.message || '请求参数不正确',
    })
  }
  const body = parsed.data

  // 获取 Turso 配置
  const config = useRuntimeConfig()
  if (!config.turso.databaseUrl || !config.turso.authToken) {
    throw createError({
      statusCode: 503,
      message: '数据库未配置，请在 .env 中设置 NUXT_TURSO_DATABASE_URL 与 NUXT_TURSO_AUTH_TOKEN',
    })
  }
  const turso = createClient({
    url: config.turso.databaseUrl,
    authToken: config.turso.authToken,
  })

  // 学生登录：姓名 + 学号精确匹配，免密
  if (body.role === 'student') {
    const result = await turso.execute({
      sql: 'SELECT id, name, student_no FROM students WHERE name = ? AND student_no = ?',
      args: [body.name, body.studentNo],
    })

    if (result.rows.length === 0) {
      throw createError({
        statusCode: 401,
        message: '姓名或学号不正确',
      })
    }

    const row = result.rows[0] as Record<string, unknown>
    await setUserSession(event, {
      user: {
        id: Number(row.id),
        name: row.name as string,
        role: 'student',
        studentNo: row.student_no as string,
      },
    })

    return { success: true }
  }

  // 教师 / 管理员登录：账号 + 密码 scrypt 哈希校验（按角色查对应表）
  const table = body.role === 'teacher' ? 'teachers' : 'admins'
  const result = await turso.execute({
    sql: `SELECT id, account, name, password_hash FROM ${table} WHERE account = ?`,
    args: [body.account],
  })

  if (result.rows.length === 0) {
    throw createError({
      statusCode: 401,
      message: '账号或密码错误',
    })
  }

  const row = result.rows[0] as Record<string, unknown>
  const isValid = await verifyPassword(row.password_hash as string, body.password)
  if (!isValid) {
    throw createError({
      statusCode: 401,
      message: '账号或密码错误',
    })
  }

  await setUserSession(event, {
    user: {
      id: Number(row.id),
      name: (row.name as string) || (row.account as string),
      role: body.role,
      account: row.account as string,
    },
  })

  return { success: true }
})
