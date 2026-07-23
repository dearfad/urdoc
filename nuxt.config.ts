import { zhCN } from '@clerk/localizations'

export default defineNuxtConfig({
  compatibilityDate: '2026-05-10',
  devtools: { enabled: false },
  modules: ['@clerk/nuxt', '@nuxt/eslint', '@nuxt/ui', '@pinia/nuxt', 'pinia-plugin-unstorage/nuxt', '@comark/nuxt'],
  clerk: {
    localization: zhCN,
    afterSignOutUrl: '/dashboard',
    proxyUrl: 'https://urdoc.dearfad.com',
  },
  css: ['~/assets/css/main.css'],
  ui: { fonts: false },
  ignore: ['/app-bak/**/*'],
  nitro: { ignore: ['/app-bak/**/*'] },

  imports: {
    dirs: [
      '~/types', // 让 Nuxt 扫描 app/types 目录
    ],
  },

  vite: {
    optimizeDeps: {
      include: ['ai', '@ai-sdk/vue', 'partial-json', '@zumer/snapdom'],
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
