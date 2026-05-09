import bookModules from '~/assets/books/index'

const VERSION = '2026-05-06'

export const useBookStore = defineStore('book', () => {
  const version = ref(VERSION)

  syncStoreVersion(VERSION, 'pinia:book')

  const books = ref<Books>({})

  async function loadBooks() {
    const modules = await Promise.all(
      Object.values(bookModules).map(fn => fn())
    )
    books.value = Object.fromEntries(
      modules
        .filter((book): book is Book => Boolean(book?.meta?.bookName))
        .map(book => [book.meta.bookName, book])
    )
  }

  loadBooks()

  return { version, books }
})
