// 扩展 nuxt-auth-utils 的会话用户模型，加入多角色字段
// 学生登录携带 studentNo，教师/管理员登录携带 account
export type LoginRole = 'student' | 'teacher' | 'admin'

declare module '#auth-utils' {
  interface User {
    id: number
    name: string
    role: LoginRole
    studentNo?: string
    account?: string
  }
}
