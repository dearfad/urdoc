type CustomItem = string | { type: 'label'; label: string } | { type: 'separator' }

const customModules = import.meta.glob<string>('~/assets/custom/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

const cache: Record<string, CustomItem[]> = {}

function parseMdContent(content: string): CustomItem[] {
  const items: CustomItem[] = []
  const lines = content.split('\n').map(l => l.trim())
  let first = true

  for (const line of lines) {
    if (!line || line === '---') continue
    if (line.startsWith('# ')) {
      if (!first) items.push({ type: 'separator' })
      first = false
      items.push({ type: 'label', label: line.slice(2) })
    } else if (line.startsWith('- ')) {
      items.push(line.slice(2))
    }
  }

  return items
}

export function getCustomItems(scene: string, sub = 'generate'): CustomItem[] {
  const key = `${scene}/${sub}`
  if (cache[key]) return cache[key]

  const path = Object.keys(customModules).find(p =>
    p.replace(/\\/g, '/').endsWith(`assets/custom/${key}.md`),
  )
  if (!path) {
    cache[key] = []
    return cache[key]
  }

  const content = customModules[path]
  cache[key] = parseMdContent(content)
  return cache[key]
}
