import books from '~/assets/books/index'

export const useBookStore = defineStore('book', () => {
  const booksRef = ref(books)
  // 导出书籍列表（用于下拉选择等）
  const bookList = computed(() =>
    Object.values(booksRef.value).map((book) => ({
      name: book.meta.bookName,
      edition: book.meta.edition,
      publishDate: book.meta.publishDate,
    })),
  )
  return { books: booksRef, bookList }
})
