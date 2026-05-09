const bookModules = import.meta.glob<Book>(['./*.ts', '!./index.ts'], {
  import: 'default',
})

export default bookModules
