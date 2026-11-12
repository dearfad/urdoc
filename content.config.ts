import { defineCollection, defineContentConfig } from '@nuxt/content'
import { z } from 'zod/v4'

export default defineContentConfig({
  collections: {
    docs: defineCollection({
      type: 'page',
      source: 'docs/**/*.md',
      schema: z.object({
        title: z.string(),
        description: z.string().optional(),
        icon: z.string().optional(),
        order: z.number().optional(),
        draft: z.boolean().optional(),
      }),
    }),
  },
})
