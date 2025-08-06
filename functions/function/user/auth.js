// https://supabase.com/docs/reference/javascript

import { createClient } from '@supabase/supabase-js'

export async function onRequest({ request, env }) {
  const { action, user } = await request.json()
  const options = {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  }
  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_KEY, options)
  const supabaseService = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY, options)
  console.log(action)
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
}
