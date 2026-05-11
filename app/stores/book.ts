import booksData from '~/assets/books/index'
const VERSION = '2026-05-11'
export const useBookStore = defineStore('book', () => {
  const version = ref(VERSION)
  const books = ref(booksData)
  syncStoreVersion(VERSION, 'pinia:book')
  return { version, books }
})
