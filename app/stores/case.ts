const VERSION = '2026-03-31'

const caseDefault = {
  id: 0,
  tags: [],
  source: null,
  content: null,
}

export const useCaseStore = defineStore('case', () => {
  const version = ref(VERSION)

  const caseItem = ref<Case>({ ...caseDefault })

  function reset() {
    caseItem.value = { ...caseDefault }
  }

  syncStoreVersion(VERSION, 'pinia:case')
  return { version, case: caseItem, reset }
})
