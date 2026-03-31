// /assets/books/index.ts

import type { Book, BookCollection } from './types'

const bookModules = import.meta.glob<Book>(['./*.ts', '!./index.ts', '!./types.ts'], {
  eager: true,
  import: 'default',
})

export const books: BookCollection = Object.fromEntries(
  Object.values(bookModules)
    .filter((book) => book?.meta?.bookName)
    .map((book) => [book.meta.bookName, book]),
) as BookCollection

export default books
