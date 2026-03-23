export default defineNuxtConfig({
  compatibilityDate: '2026-03-17',
  modules: ['@nuxt/eslint', '@nuxt/ui', '@nuxtjs/mdc', '@pinia/nuxt', 'pinia-plugin-persistedstate/nuxt'],
  css: ['~/assets/css/main.css'],
  ui: { fonts: false },
  ignore: ['/app-bak/**/*'],
  nitro: { ignore: ['/app-bak/**/*'] },
  piniaPluginPersistedstate: {
    storage: 'localStorage',
  },
  // EdgeOne Pages Functions Development
  // nitro: {
  //   devProxy: {
  //     '/function': 'http://localhost:8088/function',
  //   },
  // },

  // vite: {
  //   optimizeDeps: {
  //     include: ['@clerk/vue', '@clerk/localizations'],
  //   },
  // },
})
