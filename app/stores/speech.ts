const VERSION = '2026-05-29'

export const useSpeechStore = defineStore('speech', () => {
  const version = ref(VERSION)
  const speech = ref()

  syncStoreVersion(VERSION, 'pinia:speech')

  function reset() {
    speech.value = undefined
  }

  function generate() {}
  return { version, speech, reset, generate }
})
