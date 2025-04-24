// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
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
  // Netlify
  // compatibilityDate: '2024-05-07',
  // Cloudflare Pages
  // compatibilityDate: '2024-09-19',
  compatibilityDate: '2024-09-19',
  ssr: true,
  devtools: {
    enabled: false,
  },
  modules: ['@nuxt/eslint', '@nuxtjs/mdc', 'vuetify-nuxt-module', '@pinia/nuxt', 'pinia-plugin-persistedstate/nuxt', '@nuxtjs/supabase', '@nuxtjs/seo', // '@nuxthub/core',
  'nuxt-cloudflare-analytics', 'nuxt-clarity-analytics'],

  cloudflareAnalytics: {
    token: '97db8550f18d4cdda844ff8ab2199b36',
  },

  supabase: {
    redirect: false,
  },

  piniaPluginPersistedstate: {
    storage: 'localStorage',
  },

  routeRules: {
    '/api/**': { cors: true },
    '/docs': { redirect: 'https://urdoc.dearfad.com/docs' },
    '/cstar/**': { ssr: false },
    '/media/**': { ssr: false },
    '/admin/**': { ssr: false },
  },

  // EdgeOne Pages Dev
  nitro: {
    devProxy: {
      '/function': 'http://localhost:8088/function',
    },
  },

  vuetify: {
    vuetifyOptions: {
      defaults: {
        VSelect: {
          // variant: 'outlined',
          // density: 'comfortable',
        },
      },
    },
  },
})