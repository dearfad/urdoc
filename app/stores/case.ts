const VERSION = '2026-04-26'

const caseDefault = {
  id: 0,
  tags: [],
  textbook: null,
  custom: [],
  reasoning: null,
  content: null,
}

export const useCaseStore = defineStore('case', () => {
  const version = ref(VERSION)

  const caseItems = ref<Case>({ ...caseDefault })

  function reset() {
    caseItems.value = { ...caseDefault }
  }

  syncStoreVersion(VERSION, 'pinia:case')
  return { version, case: caseItems, reset }
})
