export default defineNuxtConfig({
  compatibilityDate: '2026-05-10',
  devtools: { enabled: false },
  modules: ['@nuxt/eslint', '@nuxt/ui', '@pinia/nuxt', 'pinia-plugin-unstorage/nuxt', '@comark/nuxt', 'nuxt-auth-utils'],
  css: ['~/assets/css/main.css'],
  ui: { fonts: false },

  app: {
    head: {
      script: [
        {
          defer: true,
          src: 'https://cloud.umami.is/script.js',
          'data-website-id': '1b97f530-f90b-4f83-9dc0-c57e6c830ee3',
        },
      ],
    },
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
