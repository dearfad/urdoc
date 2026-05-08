import { zhCN } from '@clerk/localizations'

export default defineNuxtConfig({
  compatibilityDate: '2026-03-17',
  devtools: {
    enabled: false,
  },
  modules: ['@nuxt/eslint', '@nuxt/ui', '@pinia/nuxt', 'pinia-plugin-unstorage/nuxt', '@comark/nuxt', '@clerk/nuxt'],
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
      include: ['ai', '@ai-sdk/vue', 'partial-json', '@zumer/snapdom', '@clerk/vue'],
    },
  },

  runtimeConfig: {
    shushengApiKey: '',
    zhipuApiKey: '',
    openrouterApiKey: '',
  },

  clerk: {
    localization: zhCN,
  },
  // EdgeOne Pages Functions Development
  // nitro: {
  //   devProxy: {
  //     '/function': 'http://localhost:8088/function',
  //   },
  // },
})
