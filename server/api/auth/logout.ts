import { serverSupabaseClient } from '#supabase/server'
export default defineEventHandler(async (event) => {
  const supabase = await serverSupabaseClient(event)
  const { error } = await supabase.auth.signOut()
  return { error: error }
})
