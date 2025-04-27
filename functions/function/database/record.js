import { createClient } from '@supabase/supabase-js'
export async function onRequest({ request, env }) {
  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_KEY)
  const { record, method } = await request.json()
  const handleSupabaseResponse = (data, error) => {
    if (error) return { status: 'FAILED', data: error }
    return { status: 'OK', data }
  }

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

    return new Response(JSON.stringify(result), {
      headers: {
        'content-type': 'application/json; charset=UTF-8',
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch (error) {
    return new Response(JSON.stringify({ status: 'FAILED', error: error.message }), {
      headers: {
        'content-type': 'application/json; charset=UTF-8',
        'Access-Control-Allow-Origin': '*',
      },
    })
  }
}
