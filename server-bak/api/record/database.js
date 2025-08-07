// https://supabase.nuxtjs.org/
// https://supabase.com/docs/reference/javascript

import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const { action, record } = await readBody(event)
  const supabase = await serverSupabaseClient(event)

  switch (action) {
    case 'insert':
      return await supabase.from('records').insert(record).select()
    case 'update':
      return await supabase.from('records').update(record).eq('id', record.id)
    case 'selectAll':
      return await supabase
        .from('records')
        .select(
          `id, record->case->姓名, record->case->性别, record->case->年龄, record->case->主诉, record->scope->book, record->scope->chapter`
        )
    case 'delete':
      return await supabase.from('records').delete().eq('id', record.id)
    case 'select':
      return await supabase.from('records').select().eq('id', record.id)
    default:
      return {
        status: 400,
        statusText: 'Bad Request',
        error: { code: 'Action Is Not Defined' },
      }
  }
})
