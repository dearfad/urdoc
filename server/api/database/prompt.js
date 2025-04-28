import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const { prompt, action } = await readBody(event)
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)
  const handleSupabaseResponse = (data, error) =>
    error ? { status: 'FAILED', data: error } : { status: 'OK', data: data }

  try {
    let response
    switch (action) {
      // case 'insert':
      //   {
      //     delete prompt.id
      //     const { data: insertData, error: insertError } = await supabase
      //       .from('records')
      //       .insert({ record: prompt })
      //       .select()
      //     response = handleSupabaseResponse(insertData[0].id, insertError)
      //   }
      //   break

      // case 'update':
      //   {
      //     const id = prompt.id
      //     delete prompt.id
      //     const { error: updateError } = await supabase
      //       .from('records')
      //       .update({ record: prompt })
      //       .eq('id', id)
      //     response = handleSupabaseResponse(null, updateError)
      //   }
      //   break

      case 'list':
        {
          const { data: listData, error: listError } = await supabase
            .from('prompts')
            .select(`id, type, title, prompt`)
          response = handleSupabaseResponse(listData, listError)
        }
        break

      // case 'remove':
      //   {
      //     const { data: removeData, error: removeError } = await supabase
      //       .from('records')
      //       .delete()
      //       .eq('id', prompt)
      //     response = handleSupabaseResponse(removeData, removeError)
      //   }
      //   break

      // case 'load':
      //   {
      //     const { data: loadData, error: loadError } = await supabase
      //       .from('records')
      //       .select()
      //       .eq('id', prompt)
      //     response = handleSupabaseResponse(loadData[0], loadError)
      //   }
      //   break

      default:
        response = handleSupabaseResponse('', 'Unsupported action')
    }

    return response
  } catch (error) {
    return { status: 'FAILED', data: error }
  }
})
