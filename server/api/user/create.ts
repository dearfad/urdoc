import { serverSupabaseClient } from '#supabase/server'
export default defineEventHandler(async (event) => {
  const { id, email } = await readBody(event)
  const supabase = await serverSupabaseClient(event)
  return await supabase
    .from('users')
    .insert([{ id: id, name: email, email: email }])
    .select()
    .limit(1)
    .single()
})
