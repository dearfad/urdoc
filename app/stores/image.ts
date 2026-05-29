const VERSION = '2026-05-29'

export const useImageStore = defineStore('image', () => {
  const version = ref(VERSION)
  const image = ref()

  syncStoreVersion(VERSION, 'pinia:image')

  function reset() {
    image.value = undefined
  }

  function generate() {}

  return { version, image, reset, generate }
})
