// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  ssr: true,
  devtools: {
    enabled: false,
  },
  modules: [
    '@nuxt/eslint',
    'vuetify-nuxt-module',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
    process.env.URDOC_ENV === 'edgeone' ? '' : '@nuxthub/core',
    '@nuxtjs/supabase',
    '@nuxtjs/mdc',
  ],
  supabase: {
    redirect: false,
  },
  piniaPluginPersistedstate: {
    storage: 'localStorage',
  },
})
