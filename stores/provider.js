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
      name: '本地 /api',
      url: '/api',
    },
    {
      name: 'Cloudflare',
      url: 'https://urdoc.pages.dev/api',
    },
    {
      name: 'Cloudflare(EdgeOne)',
      url: 'https://pages.dearfad.com/api',
    },
    {
      name: 'Netlify',
      url: 'https://urdoc.netlify.app/api',
    },
    {
      name: 'Netlify(EdgeOne)',
      url: 'https://netlify.dearfad.com/api',
    },
    {
      name: 'Vercel(CnameDNS)',
      url: 'https://vercel.dearfad.com/api',
    },
    {
      name: 'EdgeOne',
      url: 'https://urdoc.dearfad.com/function',
    },
    {
      name: '本地 /function (EdgeOne)',
      url: '/function',
    },
  ])
  return { sites, apiBaseUrls }
})
