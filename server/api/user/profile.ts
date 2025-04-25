// import { serverSupabaseClient } from '#supabase/server'
// export default defineEventHandler(async (event) => {
//   const { id } = await readBody(event)
//   const supabase = await serverSupabaseClient(event)
//   return await supabase.from('users').select('*').eq('id', id).limit(1).single()
// })
