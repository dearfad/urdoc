export const useProviderStore = defineStore('provider', () => {
  // 网址
  const sites = ref([
    // {
    //   name: 'Netlify',
    //   url: 'https://urdoc.netlify.app',
    // },
    {
      name: 'EdgeOne Pages',
      url: 'https://urdoc.dearfad.com',
    },
    // {
    //   name: 'Netlify(EdgeOne)',
    //   url: 'https://netlify.dearfad.com',
    // },
    // {
    //   name: 'Vercel',
    //   url: 'https://urdoc.vercel.app',
    // },
    // {
    //   name: 'Vercel(CnameDNS)',
    //   url: 'https://vercel.dearfad.com',
    // },
  ])
  // API服务网址
  const apiBaseUrls = ref([
    {
      name: 'EdgeOne Pages',
      url: '/function',
    },
    {
      name: 'Nuxt Server',
      url: '/api',
    },
    // {
    //   name: 'Netlify',
    //   url: 'https://urdoc.netlify.app/api',
    // },
    // {
    //   name: 'Netlify(EdgeOne)',
    //   url: 'https://netlify.dearfad.com/api',
    // },
    // {
    //   name: 'Vercel(CnameDNS)',
    //   url: 'https://vercel.dearfad.com/api',
    // },
  ])
  return { sites, apiBaseUrls }
})
