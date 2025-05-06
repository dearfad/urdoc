import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const { action, user } = await readBody(event)
  const supabase = await serverSupabaseClient(event)

  switch (action) {
    case 'create':
      return await supabase.from('users').insert({ id: user.id, name: user.email }).select()
    case 'update':
      return await supabase.from('users').update({ name: user.name }).eq('id', user.id).select()
    case 'retrieve':
      return await supabase.from('users').select().eq('id', user.id)
    default:
      return { error: '指令未注册' }
  }
})
