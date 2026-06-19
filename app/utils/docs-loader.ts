const docCache = import.meta.glob('~/assets/docs/**/*.md', {
  query: '?raw',
  import: 'default',
}) as Record<string, () => Promise<string>>

export function getDocContent(slug: string): Promise<string> {
  const key = slug === 'index' ? 'index' : slug
  for (const path in docCache) {
    const normalized = path.replace(/\\/g, '/')
    const match = normalized.match(/assets\/docs\/(.+)\.md$/)
    if (match && match[1] === key) {
      return docCache[path]()
    }
  }
  throw createError({ statusCode: 404, message: `Document not found: ${slug}` })
}
