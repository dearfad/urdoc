const VERSION = '2026-05-06'

export const useCaseStore = defineStore('case', () => {
  const version = ref(VERSION)
  syncStoreVersion(VERSION, 'pinia:case')

  const case_ = ref<Case>({
    id: 0,
    tags: [],
    textbook: null,
    custom: [],
    reasoning: null,
    content: null,
  })

  function reset() {
    case_.value = {
      id: 0,
      tags: [],
      textbook: null,
      custom: [],
      reasoning: null,
      content: null,
    }
  }

  function generate() {}

  function verify() {}

  return { version, case: case_, reset, generate, verify }
})
