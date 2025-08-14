export const useProviderStore = defineStore('provider', () => {
  // 网址
  const sites = ref([
    // Production
    // https://github.com/dearfad/urdoc/tree/main
    {
      name: '正式站 - https://urdoc.dearfad.com',
      url: 'https://urdoc.dearfad.com',
      branch: 'main',
    },
    // Development
    // https://github.com/dearfad/urdoc/tree/develop
    {
      name: '开发站 - https://dev.urdoc.dearfad.com',
      url: 'https://dev.urdoc.dearfad.com',
      branch: 'develop',
    },
  ])
  // API服务网址
  const apiBaseUrls = ref([
    {
      name: 'EdgeOne Pages Functions',
      url: '/function',
    },
    // {
    //   name: 'NUXT Server',
    //   url: '/api',
    // },
  ])
  return { sites, apiBaseUrls }
})
