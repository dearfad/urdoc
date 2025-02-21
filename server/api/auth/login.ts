import { serverSupabaseClient } from '#supabase/server'
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, password } = body
  const supabase = await serverSupabaseClient(event)
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  })
  return { data: data, error: error }
})
