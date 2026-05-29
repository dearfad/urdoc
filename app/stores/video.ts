const VERSION = '2026-05-29'

export const useVideoStore = defineStore('video', () => {
  const version = ref(VERSION)
  const video = ref()

  syncStoreVersion(VERSION, 'pinia:video')

  function reset() {
    video.value = undefined
  }
  function generate() {}
  return { version, video, reset, generate }
})
