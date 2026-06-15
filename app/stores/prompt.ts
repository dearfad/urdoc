import { getPrompt } from '~/utils/prompts'

const VERSION = '2026-06-15'

export const usePromptStore = defineStore('prompt', () => {
  const version = ref(VERSION)
  syncStoreVersion(VERSION, 'pinia:prompt')

  const customPrompts = ref<Record<string, string>>({})

  async function getEffectivePrompt(type: string, task: string): Promise<string> {
    const key = `${type}/${task}`
    if (customPrompts.value[key]) return customPrompts.value[key]
    return await getPrompt(type, task)
  }

  function setPrompt(type: string, task: string, content: string) {
    const key = `${type}/${task}`
    customPrompts.value[key] = content
  }

  function resetPrompt(type: string, task: string) {
    const key = `${type}/${task}`
    delete customPrompts.value[key]
  }

  function isCustom(type: string, task: string): boolean {
    const key = `${type}/${task}`
    return key in customPrompts.value
  }

  return {
    version,
    customPrompts,
    getEffectivePrompt,
    setPrompt,
    resetPrompt,
    isCustom,
  }
})
