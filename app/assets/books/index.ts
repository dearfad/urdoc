// ~/assets/books/index.ts

const bookModules = import.meta.glob<Book>(['./*.ts', '!./index.ts'], {
  eager: true,
  import: 'default',
})

export const books: Books = Object.fromEntries(
  Object.values(bookModules)
    .filter((book) => book?.meta?.bookName)
    .map((book) => [book.meta.bookName, book]),
) as Books

export default books
