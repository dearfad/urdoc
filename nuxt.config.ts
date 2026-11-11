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
    // 首次访问按浏览器语言自动切换；alwaysRedirect 让 cookie 记住用户后续的手动选择
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',
      alwaysRedirect: true,
      fallbackLocale: 'en',
    },
  },
  ignore: ['/app-bak/**/*'],
  nitro: { ignore: ['/app-bak/**/*'] },

  routeRules: {
    // 首页语言取决于 Accept-Language 与语言 cookie，声明 Vary 防止 CDN 把首个用户的语言缓存给其他人
    '/': { headers: { Vary: 'Accept-Language, Cookie' } },
  },

  imports: {
    dirs: [
      '~/types', // 让 Nuxt 扫描 app/types 目录
    ],
  },

  vite: {
    optimizeDeps: {
      include: [
        'ai',
        '@ai-sdk/vue',
        'partial-json',
        '@zumer/snapdom',
        '@zumer/snapdom-plugins/pdf',
        'vue-draggable-plus',
      ],
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
