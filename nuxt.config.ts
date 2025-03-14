// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  ssr: true,
  devtools: {
    enabled: false,
  },
  site: {
    url: 'https://urdoc.dearfad.com',
    name: 'URDOC',
  },
  seo: {
    meta: {
      description:
        'URDOC Virtual Case Research Institute: Pioneering in AI-generated medical cases, storytelling, question formulation, and consultation simulation for comprehensive capability assessment in healthcare education and research.',
    },
  },
  modules: [
    '@nuxt/eslint',
    'vuetify-nuxt-module',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
    '@nuxthub/core',
    '@nuxtjs/supabase',
    '@nuxtjs/seo',
    '@nuxtjs/mdc',
  ],
  supabase: {
    redirect: false,
  },
  piniaPluginPersistedstate: {
    storage: 'localStorage',
  },
  nitro: {
    devProxy: {
      '/api/xfyun': {
        target: 'https://spark-api-open.xf-yun.com',
        changeOrigin: true,
      },
      '/api/doubao': {
        target: 'https://ark.cn-beijing.volces.com',
        changeOrigin: true,
      },
    },
  },
  routeRules: {
    '/api/xfyun/**': {
      proxy: 'https://spark-api-open.xf-yun.com/**',
    },
    '/api/doubao/**': {
      proxy: 'https://ark.cn-beijing.volces.com/**',
    },
  },

  runtimeConfig: {
    apiKey: '',
  },
})
