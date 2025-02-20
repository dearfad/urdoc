// import { serverSupabaseClient } from '#supabase/server'
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  // const supabase = await serverSupabaseClient(event)
  console.log(body)
  // const { error } = await supabase.auth.signInWithPassword({
  //   email: email.value,
  //   password: password.value,
  // })
  return body
})
