import { serverSupabaseClient } from '#supabase/server'
export default defineEventHandler(async (event) => {
  const { action, user } = await readBody(event)
  const supabase = await serverSupabaseClient(event)

  switch (action) {
    case 'login':
      return await supabase.auth.signInWithPassword({
        email: user.email,
        password: user.password,
      })
    case 'logout':
      return await supabase.auth.signOut()
    case 'register':
      return await supabase.auth.signUp({
        email: user.email,
        password: user.password,
      })
    default:
      return { error: '指令未注册' }
  }
})
