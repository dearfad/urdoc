import { createClient } from '@supabase/supabase-js'

export default function () {
  async function getData(action, prompt = null) {
    const userStore = useUserStore()
    const config = useRuntimeConfig()

    // https://clerk.com/docs/integrations/databases/supabase
    const supabase = createClient(config.public.supabaseUrl, config.public.supabaseKey, {
      async accessToken() {
        return userStore.session?.getToken() ?? null
      },
    })

    switch (action) {
      case 'selectAll':
        return await supabase.from('prompts').select().order('id', { ascending: true })
      // case 'select':
      //   return await supabase.from('prompts').eq('id', prompt.id).select()
      case 'insert':
        return await supabase.from('prompts').insert(prompt).select()
      case 'update':
        return await supabase.from('prompts').update(prompt).eq('id', prompt.id).select()
      case 'delete':
        return await supabase.from('prompts').delete().eq('id', prompt.id).select()
      default:
        return {
          status: 400,
          statusText: 'Bad Request',
          error: { code: 'Action Is Not Defined' },
        }
    }
  }
  return { getData }
}

// https://supabase.nuxtjs.org/
// https://supabase.com/docs/reference/javascript

// import { serverSupabaseClient } from '#supabase/server'

// export default defineEventHandler(async (event) => {
//   const { action, prompt, user } = await readBody(event)
//   const supabase = await serverSupabaseClient(event)

//   switch (action) {
//     case 'selectAll':
//       return await supabase
//         .from('prompts')
//         .select()
//         .or(`public.eq.true,author.eq.${user.id}`)
//         .order('id', { ascending: true })
//     case 'select':
//       return await supabase.from('prompts').eq('id', prompt.id).select()
//     case 'insert':
//       return await supabase.from('prompts').insert(prompt).select()
//     case 'update':
//       return await supabase.from('prompts').update(prompt).eq('id', prompt.id).select()
//     case 'delete':
//       return await supabase.from('prompts').delete().eq('id', prompt.id).select()
//     default:
//       return {
//         status: 400,
//         statusText: 'Bad Request',
//         error: { code: 'Action Is Not Defined' },
//       }
//   }
// })
