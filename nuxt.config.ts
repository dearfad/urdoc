// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  ssr: true,
  devtools: {
    enabled: false,
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
  modules: ['@nuxt/eslint', 'vuetify-nuxt-module', '@pinia/nuxt', 'pinia-plugin-persistedstate/nuxt', '@nuxthub/core', '@nuxtjs/supabase', '@nuxtjs/seo', '@nuxtjs/mdc', '@nuxt/fonts'],
  supabase: {
    redirect: false,
  },
  piniaPluginPersistedstate: {
    storage: 'localStorage',
  },
  routeRules: {
    '/cstar/**': { ssr: false },
    '/media/**': { ssr: false },
  },
})