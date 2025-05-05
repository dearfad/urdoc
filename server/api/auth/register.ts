import { serverSupabaseClient } from '#supabase/server'
export default defineEventHandler(async (event) => {
  const { email, password } = await readBody(event)
  const supabase = await serverSupabaseClient(event)
  return await supabase.auth.signUp({
    email: email,
    password: password,
  })
})
