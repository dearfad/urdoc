// import { zhCN, enUs } from '@clerk/localizations'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: true,
  compatibilityDate: '2025-08-08',
  devtools: {
    enabled: false,
  },
  modules: [
    '@nuxt/eslint',
    '@nuxtjs/mdc',
    'vuetify-nuxt-module',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
    '@clerk/nuxt',
    '@nuxtjs/i18n',
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
  },

  // EdgeOne Pages Functions Development
  nitro: {
    devProxy: {
      '/function': 'http://localhost:8088/function',
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
    locales: [
      { code: 'zh', name: '中文', file: 'zh/index.ts' },
      { code: 'en', name: 'English', file: 'en/index.ts' },
    ],
    langDir: 'locales/',
    vueI18n: './i18n.config.ts',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root', // recommended
    },
  },
})
