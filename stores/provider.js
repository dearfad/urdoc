export const useProviderStore = defineStore('provider', () => {
  // 网址
  const sites = ref([
    {
      name: 'Cloudflare',
      url: 'https://urdoc.pages.dev',
    },
    {
      name: 'EdgeOne',
      url: 'https://urdoc.dearfad.com',
    },
    {
      name: 'Cloudflare(EdgeOne)',
      url: 'https://pages.dearfad.com',
    },
    {
      name: 'Netlify',
      url: 'https://urdoc.netlify.app',
    },
    {
      name: 'Netlify(EdgeOne)',
      url: 'https://netlify.dearfad.com',
    },
    {
      name: 'Vercel',
      url: 'https://urdoc.vercel.app',
    },
    {
      name: 'Vercel(CnameDNS)',
      url: 'https://vercel.dearfad.com',
    },
  ])
  // API服务网址
  const apiBaseUrls = ref([
    {
      name: 'Cloudflare',
      url: 'https://urdoc.pages.dev/api',
    },
    {
      name: 'Netlify',
      url: 'https://urdoc.netlify.app/api',
    },
    {
      name: 'EdgeOne',
      url: 'https://urdoc.dearfad.com/function',
    },
    {
      name: 'Vercel',
      url: 'https://vercel.dearfad.com/api',
    },
  ])
  return { sites, apiBaseUrls }
})
