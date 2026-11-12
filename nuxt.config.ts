export default defineNuxtConfig({
  compatibilityDate: '2026-05-10',
  devtools: { enabled: false },
  // 显式给出字符串，避免 Nuxt 4.6.4 把 devServer.host 解析成 {} 写入 dev-server.json 缓存后启动崩溃
  devServer: { host: 'localhost' },
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@pinia/nuxt',
    'pinia-plugin-unstorage/nuxt',
    '@comark/vue',
    'nuxt-auth-utils',
    '@nuxtjs/i18n',
    '@nuxt/content',
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
  content: {
    // 构建期用 Node 内置 SQLite，避开 pnpm allowBuilds 与跨平台原生二进制
    experimental: { sqliteConnector: 'native' },
  },
  vite: {
    optimizeDeps: {
      include: ['ai', '@ai-sdk/vue', 'partial-json', '@zumer/snapdom', '@zumer/snapdom-pdf', 'vue-draggable-plus'],
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
