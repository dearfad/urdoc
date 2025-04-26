import { createClient } from '@supabase/supabase-js'
export default defineEventHandler(async (event) => {
  const { record, method } = await readBody(event)
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)
  // data = {error:null,data:[],count:null,status:200,statusText:'OK'}
  const handlers = {
    insert: async (record) => {
      delete record.id
      const { data, error } = await supabase.from('records').insert({ record: record }).select()
      if (error) {
        return { status: 'FAILED', data: error }
      } else {
        return { status: 'OK', data: data[0].id }
      }
    },

    update: async (record) => {
      const id = record.id
      delete record.id
      const { error } = await supabase.from('records').update({ record: record }).eq('id', id)
      if (error) {
        return { status: 'FAILED', data: error }
      } else {
        return { status: 'OK' }
      }
    },

    list: async () => {
      const { data, error } = await supabase
        .from('records')
        .select(
          `id, record->case->姓名, record->case->性别, record->case->年龄, record->case->主诉`
        )
      if (error) {
        return { status: 'FAILED', data: error }
      } else {
        return { status: 'OK', data: data }
      }
    },

    remove: async (record) => {
      const { data, error } = await supabase.from('records').delete().eq('id', record)
      if (error) {
        return { status: 'FAILED', data: error }
      } else {
        return { status: 'OK', data: data }
      }
    },

    load: async (record) => {
      const { data, error } = await supabase.from('records').select().eq('id', record)
      if (error) {
        return { status: 'FAILED', data: error }
      } else {
        return { status: 'OK', data: data[0] }
      }
    },
  }

  try {
    const handler = handlers[method]
    const result = await handler(record)
    return result
  } catch (error) {
    console.error('Error in event handler:', error)
    return { status: 'FAILED', error: error.message }
  }
})
