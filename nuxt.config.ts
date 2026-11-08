export default defineNuxtConfig({
  compatibilityDate: '2026-05-10',
  devtools: { enabled: false },
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@pinia/nuxt',
    'pinia-plugin-unstorage/nuxt',
    '@comark/nuxt',
    'nuxt-auth-utils',
    '@nuxtjs/i18n',
  ],
  css: ['~/assets/css/main.css'],
  ui: { fonts: false },
  i18n: {
    defaultLocale: 'zh',
    strategy: 'prefix_except_default',
    langDir: 'locales',
    locales: [
      { code: 'zh', language: 'zh-Hans', name: '简体中文', file: 'zh.json' },
      { code: 'en', language: 'en-US', name: 'English', file: 'en.json' },
    ],
    vueI18n: './i18n.config.ts',
    detectBrowserLanguage: false,
  },
  ignore: ['/app-bak/**/*'],
  nitro: { ignore: ['/app-bak/**/*'] },

  imports: {
    dirs: [
      '~/types', // 让 Nuxt 扫描 app/types 目录
    ],
  },

  vite: {
    optimizeDeps: {
      include: ['ai', '@ai-sdk/vue', 'partial-json', '@zumer/snapdom', 'vue-draggable-plus'],
    },
  },

  runtimeConfig: {
    shushengApiKey: '',
    zhipuApiKey: '',
    openrouterApiKey: '',
    longcatApiKey: '',
    agnesApiKey: '',
    giteeApiKey: '',
    githubApiToken: '',
    xiaomiApiKey: '',
    makersModelsKey: '',
    turso: {
      databaseUrl: '',
      authToken: '',
    },
  },
})
