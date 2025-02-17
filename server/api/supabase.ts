import { serverSupabaseClient } from '#supabase/server'
export default defineEventHandler(async (event) => {
  const supabase = await serverSupabaseClient(event)
  const { data, error } = await supabase
    .from('cases')
    .select(
      'id, book, chapter, section, subsection, casetag, content, public, validated, platform, model_name, model_id'
    )
    .order('id')

  return { data, error }
})
