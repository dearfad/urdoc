const VERSION = '2026-05-06'

const testDefault = {
  id: 0,
  tags: [],
  custom: [],
  reasoning: null,
  content: null,
}

export const useTestStore = defineStore('test', () => {
  const version = ref(VERSION)

  const test = ref<Test>({ ...testDefault })

  function reset() {
    test.value = { ...testDefault }
  }

  syncStoreVersion(VERSION, 'pinia:test')
  return { version, test, reset }
})
