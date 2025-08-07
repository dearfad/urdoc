// https://supabase.nuxtjs.org/
// https://supabase.com/docs/reference/javascript

import { createClient } from '@supabase/supabase-js'

export async function onRequest({ request, env }) {
  const { action, user } = await request.json()
  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_KEY)
  const supabaseService = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY)

  switch (action) {
    case 'insert':
      return await supabase.from('users').insert({ id: user.id, name: user.email }).select()
    case 'updateName':
      return await supabase.from('users').update({ name: user.name }).eq('id', user.id).select()
    case 'select':
      return await supabase.from('users').select().eq('id', user.id)
    default:
      return {
        status: 400,
        statusText: 'Bad Request',
        error: { code: 'Action Is Not Defined' },
      }
  }
}
