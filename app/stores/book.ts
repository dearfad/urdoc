const VERSION = '2026-03-31'
import books from '~/assets/books/index'
export const useBookStore = defineStore('book', () => {
  const version = ref(VERSION)
  const booksRef = ref(books)
  // 导出书籍列表（用于下拉选择等）
  const bookList = computed(() =>
    Object.values(booksRef.value).map((book) => ({
      name: book.meta.bookName,
      edition: book.meta.edition,
      publishDate: book.meta.publishDate,
    })),
  )
  syncStoreVersion(VERSION, 'pinia:book')
  return { version, books: booksRef, bookList }
})
