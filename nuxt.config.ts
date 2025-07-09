// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-01',
  nitro: {
    cloudflare: {
      deployConfig: true,
      nodeCompat: true,
    },
  },
  site: {
    url: 'https://urdoc.dearfad.com',
    name: 'URDOC',
  },
  seo: {
    meta: {
      description:
        'URDOC Virtual Case Research Institute: Pioneering in AI-generated medical cases, storytelling, question formulation, and consultation simulation for comprehensive capability assessment in healthcare education and research.',
    },
  },
  ssr: true,
  devtools: {
    enabled: false,
  },
  modules: [
    '@nuxt/eslint',
    '@nuxtjs/mdc',
    'vuetify-nuxt-module',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
    '@nuxtjs/seo',
    '@nuxtjs/supabase',
  ],

  piniaPluginPersistedstate: {
    storage: 'localStorage',
  },

  routeRules: {
    '/api/**': { cors: true },
    '/docs': { redirect: 'https://urdoc.dearfad.com/docs' },
    '/cstar/**': { ssr: false },
    '/image/**': { ssr: false },
    '/video/**': { ssr: false },
    '/audio/**': { ssr: false },
    '/admin/**': { ssr: false },
    '/user/**': { ssr: false },
  },

  // EdgeOne Pages Dev
  nitro: {
    devProxy: {
      '/function': 'http://localhost:8088/function',
    },
  },

  supabase: {
    redirect: false,
  },
})
