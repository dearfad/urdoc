const VERSION = '2026-05-06'

const storyDefault = {
  id: 0,
  tags: [],
  custom: [],
  reasoning: null,
  content: null,
}

export const useRateStore = defineStore('rate', () => {
  const version = ref(VERSION)

  const rate = ref<Rate>({ ...storyDefault })

  function reset() {
    rate.value = { ...storyDefault }
  }

  syncStoreVersion(VERSION, 'pinia:rate')
  return { version, rate, reset }
})
