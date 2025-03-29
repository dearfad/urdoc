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
    '/api/**': {
      cors: true,
      headers: { 'access-control-allow-methods': '*' },
    },
    '/docs': { redirect: 'https://urdoc.dearfad.com/docs' },
  },
})
