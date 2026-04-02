import books from '~/assets/books/index'

const VERSION = '2026-03-31'

export const useBookStore = defineStore('book', () => {
  const version = ref(VERSION)

  syncStoreVersion(VERSION, 'pinia:book')
  return { version, books }
})
