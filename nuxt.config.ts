export default defineNuxtConfig({
  compatibilityDate: '2026-03-17',
  modules: ['@nuxt/eslint', '@nuxt/ui', '@nuxt/content'],
  css: ['~/assets/css/main.css'],
  ui: { fonts: false },
  vite: {
    optimizeDeps: {
      include: [],
    },
  },
})
