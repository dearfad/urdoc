// import { zhCN, enUs } from '@clerk/localizations'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: true,
  compatibilityDate: '2025-12-14',
  css: ['~/assets/css/default.css'],

  modules: [
    '@clerk/nuxt',
    '@nuxt/eslint',
    '@nuxtjs/i18n',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
    'vuetify-nuxt-module',
  ],

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
    '/site/**': { ssr: false },
  },

  // EdgeOne Pages Functions Development
  nitro: {
    devProxy: {
      '/function': 'http://localhost:8088/function',
    },
    prerender: {
      ignore: ['/i18n/**', '/_i18n/**'],
    },
  },

  // Clerk Configuration
  // clerk: {
  //   localization: zhCN,
  // },

  // Supabase Runtime Configuration
  runtimeConfig: {
    public: {
      supabaseUrl: '',
      supabaseKey: '',
    },
  },

  // Nuxt i18n Configuration
  i18n: {
    defaultLocale: 'zh',
    langDir: 'locales/',
    locales: [
      { code: 'zh', name: '中文', file: 'zh/index.ts' },
      { code: 'en', name: 'English', file: 'en/index.ts' },
    ],
    strategy: 'no_prefix',
  },

  devtools: {
    enabled: false,
  },

  vuetify: {
    vuetifyOptions: {
      icons: {
        defaultSet: 'mdi-svg',
      },
    },
  },
})
