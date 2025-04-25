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
