import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const { action, prompt } = await readBody(event)
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)

  try {
    let response
    switch (action) {
      case 'list':
        response = await supabase.from('prompts').select().order('id', { ascending: true })
        break
      case 'fetch':
        response = await supabase.from('prompts').eq('id', prompt.id).select()
        break
      case 'insert':
        response = await supabase.from('prompts').insert(prompt).select()
        break
      case 'update':
        response = await supabase.from('prompts').update(prompt).eq('id', prompt.id).select()
        break
      case 'delete':
        response = await supabase.from('prompts').delete().eq('id', prompt.id)
        break
      default:
        response = { data: '', error: 'Unsupported action' }
    }
    return response.error
      ? { status: '', data: response.error }
      : { status: 'OK', data: response.data }
  } catch (error) {
    return { status: '', data: error }
  }
})
