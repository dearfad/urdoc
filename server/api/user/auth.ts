// https://supabase.nuxtjs.org/
// https://supabase.com/docs/reference/javascript

import { serverSupabaseClient, serverSupabaseServiceRole } from '#supabase/server'
export default defineEventHandler(async (event) => {
  const { action, user } = await readBody(event)
  const supabase = await serverSupabaseClient(event)
  const supabaseService = serverSupabaseServiceRole(event)
  switch (action) {
    case 'signin':
      return await supabase.auth.signInWithPassword({
        email: user.email,
        password: user.password,
      })
    case 'signout':
      return await supabase.auth.signOut()
    case 'signup':
      return await supabase.auth.signUp({
        email: user.email,
        password: user.password,
      })
    case 'deleteuser':
      return supabaseService.auth.admin.deleteUser(user.id)
    default:
      return {
        status: 400,
        statusText: 'Bad Request',
        error: { message: 'Action Is Not Defined' },
      }
  }
})
