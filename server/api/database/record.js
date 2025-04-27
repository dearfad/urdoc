import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)

const handleSupabaseResponse = (data, error) => {
  if (error) return { status: 'FAILED', data: error }
  return { status: 'OK', data }
}

export default defineEventHandler(async (event) => {
  const { record, method } = await readBody(event)

  try {
    let result
    switch (method) {
      case 'insert':
        {
          delete record.id
          const { data: insertData, error: insertError } = await supabase
            .from('records')
            .insert({ record })
            .select()
          result = handleSupabaseResponse(insertData[0].id, insertError)
        }
        break

      case 'update':
        {
          const id = record.id
          delete record.id
          const { error: updateError } = await supabase
            .from('records')
            .update({ record })
            .eq('id', id)
          result = handleSupabaseResponse(null, updateError)
        }
        break
      case 'list':
        {
          const { data: listData, error: listError } = await supabase
            .from('records')
            .select(
              `id, record->case->姓名, record->case->性别, record->case->年龄, record->case->主诉`
            )
          result = handleSupabaseResponse(listData, listError)
        }
        break

      case 'remove':
        {
          const { data: removeData, error: removeError } = await supabase
            .from('records')
            .delete()
            .eq('id', record)
          result = handleSupabaseResponse(removeData, removeError)
        }
        break

      case 'load':
        {
          const { data: loadData, error: loadError } = await supabase
            .from('records')
            .select()
            .eq('id', record)
          result = handleSupabaseResponse(loadData[0], loadError)
        }
        break

      default:
        throw new Error(`Unsupported method: ${method}`)
    }

    return result
  } catch (error) {
    console.error('Error in event handler:', error)
    return { status: 'FAILED', error: error.message }
  }
})
