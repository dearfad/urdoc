import { createClient } from '@supabase/supabase-js'

export default function () {
  function getData(table) {
    const stateStore = useStateStore()
    const userStore = useUserStore()
    const runtimeConfig = useRuntimeConfig()

    // https://clerk.com/docs/integrations/databases/supabase
    const supabase = createClient(
      runtimeConfig.public.supabaseUrl,
      runtimeConfig.public.supabaseKey,
      {
        async accessToken() {
          return userStore.session?.getToken() ?? null
        },
      }
    )

    // 出现错误时，将错误信息推送到全局消息中，无论是否出错都返回原始响应
    const execute = (query) =>
      query.then(
        (response) => (response.error && stateStore.appInfos.push(response.error), response)
      )

    const selectAll = () => execute(supabase.from(table).select().order('id', { ascending: true }))
    const select = (row) => execute(supabase.from(table).eq('id', row.id).select())
    const insert = (row) => execute(supabase.from(table).insert(row).select())
    const update = (row) => execute(supabase.from(table).update(row).eq('id', row.id).select())
    const del = (row) => execute(supabase.from(table).delete().eq('id', row.id).select())

    return { selectAll, select, insert, update, del }
  }
  return { getData }
}
