import { zhCN } from '@clerk/localizations'

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
  clerk: {
    localization: zhCN,
  },

  // Supabase Runtime Configuration
  runtimeConfig: {
    public: {
      supabaseUrl: '',
      supabaseKey: '',
    },
  },

  // Internationalization Configuration
  i18n: {
    defaultLocale: 'zh',
    locales: [
      { code: 'zh', name: '中文', file: 'zh.json' },
      { code: 'en', name: 'English', file: 'en.json' },
    ],
  },
})
