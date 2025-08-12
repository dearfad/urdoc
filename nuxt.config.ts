import { zhCN } from '@clerk/localizations'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: true,
  compatibilityDate: '2025-08-08',
  // site: {
  //   url: 'https://urdoc.dearfad.com',
  //   name: 'URDOC',
  // },
  // seo: {
  //   meta: {
  //     description:
  //       'URDOC Virtual Case Research Institute: Pioneering in AI-generated medical cases, storytelling, question formulation, and consultation simulation for comprehensive capability assessment in healthcare education and research.',
  //   },
  // },
  devtools: {
    enabled: false,
  },

  modules: [
    '@nuxt/eslint',
    '@nuxtjs/mdc',
    'vuetify-nuxt-module',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
    // '@nuxtjs/seo',
    '@clerk/nuxt',
  ],

  clerk: {
    localization: zhCN,
  },

  piniaPluginPersistedstate: {
    storage: 'localStorage',
  },

  routeRules: {
    '/cstar/**': { ssr: false },
    '/image/**': { ssr: false },
    '/video/**': { ssr: false },
    '/audio/**': { ssr: false },
    '/admin/**': { ssr: false },
    '/user/**': { ssr: false },
    '/project/**': { ssr: false },
  },

  // EdgeOne Pages Functions Development
  nitro: {
    devProxy: {
      '/function': 'http://localhost:8088/function',
    },
  },
  runtimeConfig: {
    public: {
      supabaseUrl: '',
      supabaseKey: '',
    },
  },
})
