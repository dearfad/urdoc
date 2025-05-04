// import { createClient } from '@supabase/supabase-js'
import { serverSupabaseClient } from '#supabase/server'
export default defineEventHandler(async (event) => {
  const { action, prompt } = await readBody(event)
  // const supabase = createClient(process.env.supabaseUrl, process.env.supabaseKey)
  const supabase = await serverSupabaseClient(event)
  try {
    const tableRef = supabase.from('prompts')
    const response = await handleDatabaseAction(action, tableRef, prompt)
    return response.error
      ? { status: '', data: response.error }
      : { status: 'OK', data: response.data }
  } catch (error) {
    return { status: '', data: error }
  }
})

async function handleDatabaseAction(action, tableRef, prompt) {
  switch (action) {
    case 'list':
      return await tableRef.select().order('id', { ascending: true })
    case 'fetch':
      return await tableRef.eq('id', prompt.id).select()
    case 'insert':
      return await tableRef.insert(prompt).select()
    case 'update':
      return await tableRef.update(prompt).eq('id', prompt.id).select()
    case 'delete':
      return await tableRef.delete().eq('id', prompt.id).select()
    default:
      return { status: '', data: 'Unsupported action' }
  }
}
