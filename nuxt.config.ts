// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
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
    '@nuxtjs/supabase',
    process.env.HOSTING_PROVIDER === 'edgeone' ? '' : '@nuxthub/core',
  ],
  supabase: {
    redirect: false,
  },
  piniaPluginPersistedstate: {
    storage: 'localStorage',
  },
  routeRules: {
    '/api/**': { cors: true },
    '/docs': { redirect: 'https://urdoc.dearfad.com/docs' },
    '/cstar/**': { ssr: false },
    '/media/**': { ssr: false },
    '/admin/**': { ssr: false },
  },
  runtimeConfig: {
    public: {
      apiBaseURL: process.env.HOSTING_PROVIDER === 'edgeone' ? 'https://pages.dearfad.com' : '',
    },
  },
})
