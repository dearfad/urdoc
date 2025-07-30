export const useProviderStore = defineStore('provider', () => {
  // 网址
  const sites = ref([
    {
      name: 'Netlify',
      url: 'https://urdoc.netlify.app',
    },
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
      name: 'edge function',
      url: 'https://urdoc-zone-3a1jc7cro7gc-1257866770.eo-edgefunctions.com',
    },
    {
      name: '本地',
      url: 'http://60.205.141.59',
    },
    {
      name: 'Netlify',
      url: 'https://urdoc.netlify.app/api',
    },
    {
      name: '本地接口 /api',
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
