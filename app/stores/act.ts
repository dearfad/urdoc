const VERSION = '2026-05-07'

const actDefault = {
  id: 0,
  caseId: null,
  custom: [],
  reasoning: null,
  content: [],
}

export const useActStore = defineStore('act', () => {
  const version = ref(VERSION)

  const act = ref<Act>({ ...actDefault })

  function reset() {
    act.value = { ...actDefault }
  }

  syncStoreVersion(VERSION, 'pinia:act')
  return { version, act, reset }
})
