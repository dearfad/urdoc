// https://supabase.nuxtjs.org/
// https://supabase.com/docs/reference/javascript

import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const { action, user } = await readBody(event)
  const supabase = await serverSupabaseClient(event)

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
})
