// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2024-04-03',
    devtools: { enabled: false },
    site: {
        url: 'https://urdoc.dearfad.com',
        name: 'URDOC',
    },
    seo: {
        meta: {
            description:
                'URDOC, Virtual Case Research Institute, is an integrated virtual case study platform that utilizes large language models to generate medical cases, compose stories, design questions, simulate consultations, and assess capabilities.',
        },
    },
    modules: [
        'vuetify-nuxt-module',
        '@nuxt/eslint',
        '@pinia/nuxt',
        '@nuxtjs/eslint-module',
        '@nuxthub/core',
        '@nuxt/content',
        'nuxt-cloudflare-analytics',
        '@nuxtjs/supabase',
        '@nuxtjs/seo',
    ],
    cloudflareAnalytics: {
        token: '97db8550f18d4cdda844ff8ab2199b36',
    },
    supabase: {
        redirect: false,
    },
    app: {
        pageTransition: { name: 'page', mode: 'out-in' },
    },
})
