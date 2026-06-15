const promptCache = import.meta.glob('~/assets/prompts/**/*.md', {
  query: '?raw',
  import: 'default',
}) as Record<string, () => Promise<string>>

export function getAvailablePrompts(): Record<string, string[]> {
  const map: Record<string, string[]> = {}
  for (const p in promptCache) {
    const normalized = p.replace(/\\/g, '/')
    const match = normalized.match(/assets\/prompts\/(\w+)\/(\w+)\.md$/)
    if (match) {
      const [, type, task] = match
      ;(map[type] ??= []).push(task)
    }
  }
  return map
}

export async function getPrompt(type: string, task: string, caseContent?: any): Promise<string> {
  const key = `${type}/${task}`
  let path = ''
  for (const p in promptCache) {
    if (p.replace(/\\/g, '/').endsWith(`assets/prompts/${key}.md`)) {
      path = p
      break
    }
  }
  if (!path) return ''
  const loader = promptCache[path]
  if (!loader) return ''
  let prompt = await loader()
  if (type === 'act' && caseContent) {
    prompt += `\n\n病例内容：${JSON.stringify(caseContent)}`
  }
  return prompt
}
