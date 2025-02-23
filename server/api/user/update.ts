import { serverSupabaseClient } from '#supabase/server'
export default defineEventHandler(async (event) => {
  const { id, name } = await readBody(event)
  const supabase = await serverSupabaseClient(event)
  return await supabase.from('users').update({ name: name }).eq('id', id).select().single()
})
