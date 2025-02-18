import { serverSupabaseClient } from '#supabase/server'
export default defineEventHandler(async (event) => {
  const supabaseClient = await serverSupabaseClient(event)
  const { data, error } = await supabaseClient
    .from('cases')
    .select(
      'id, book, chapter, section, subsection, casetag, content, public, validated, platform, model_name, model_id'
    )
    .order('id')
  return { data, error }
})
