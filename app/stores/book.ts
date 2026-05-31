import booksData from '~/assets/books/index'
const VERSION = '2026-05-11'
export const useBookStore = defineStore('book', () => {
  const version = ref(VERSION)
  syncStoreVersion(VERSION, 'pinia:book')
  const books = ref(booksData)
  return { version, books }
})
