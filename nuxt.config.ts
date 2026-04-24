export default defineNuxtConfig({
  compatibilityDate: '2026-03-17',
  modules: ['@nuxt/eslint', '@nuxt/ui', '@nuxtjs/mdc', '@pinia/nuxt', 'pinia-plugin-unstorage/nuxt'],
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
      include: ['ai', '@ai-sdk/vue', 'partial-json'],
    },
  },
  runtimeConfig: {
    shushengApiKey: '',
  },
  // EdgeOne Pages Functions Development
  // nitro: {
  //   devProxy: {
  //     '/function': 'http://localhost:8088/function',
  //   },
  // },
})
