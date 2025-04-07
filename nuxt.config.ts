// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // Netlify
  // compatibilityDate: '2024-05-07',
  // Cloudflare Pages
  // compatibilityDate: '2024-09-19',
  compatibilityDate: '2024-09-19',
  ssr: true,
  devtools: {
    enabled: false,
  },
  modules: [
    '@nuxt/eslint',
    '@nuxtjs/mdc',
    'vuetify-nuxt-module',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
    '@nuxtjs/supabase',
    '@nuxtjs/seo',
    // '@nuxthub/core',
  ],

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

  // branch develop

  // branch develop 2
})
