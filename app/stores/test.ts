const VERSION = '2026-05-06'

export const useTestStore = defineStore('test', () => {
  const version = ref(VERSION)
  syncStoreVersion(VERSION, 'pinia:test')

  const test = ref<Test>({
    id: 0,
    tags: [],
    custom: [],
    reasoning: null,
    content: null,
  })

  function reset() {
    test.value = {
      id: 0,
      tags: [],
      custom: [],
      reasoning: null,
      content: null,
    }
  }

  return { version, test, reset }
})
