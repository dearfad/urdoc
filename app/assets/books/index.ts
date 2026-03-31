// /assets/books/index.ts

import type { Book, BookCollection } from './types'

const EXCLUDED_FILES = ['./index.ts', './types.ts']

const bookModules = import.meta.glob<Book>('./*.ts', {
  eager: true,
  import: 'default',
})

export const books: BookCollection = Object.entries(bookModules).reduce((acc, [path, book]) => {
  if (EXCLUDED_FILES.includes(path)) return acc
  if (book?.meta?.bookName) {
    acc[book.meta.bookName] = book
  }
  return acc
}, {} as BookCollection)

export default books
