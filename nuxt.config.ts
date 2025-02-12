// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  ssr: true,
  devtools: { enabled: false },
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
    'vuetify-nuxt-module',
    '@nuxt/eslint',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
    '@nuxtjs/eslint-module',
    '@nuxthub/core',
    // 'nuxt-cloudflare-analytics',
    '@nuxtjs/supabase',
    '@nuxtjs/seo',
    '@nuxtjs/mdc',
  ],
  // cloudflareAnalytics: {
  //     token: '97db8550f18d4cdda844ff8ab2199b36',
  // },
  supabase: {
    redirect: false,
  },
  app: {
    // 页面切换动画，同时更新app.vue中的transition属性
    // pageTransition: { name: 'page', mode: 'out-in' },
    pageTransition: false,
    layoutTransition: false,
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
    prerender: {
      // Pre-render the homepage
      routes: ['/'],
      // Then crawl all the links on the page
      crawlLinks: true,
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
    testApiKey: '12345',
    // public: {
    //   supabaseUrl: process.env.SUPABASE_URL,
    // },
  },
})
