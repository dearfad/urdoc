# 配置说明

## 自定义书籍目录

1. 编辑 ~/assets/books/book.js

```js
export default {
  篇目1: {
    章节1: {
      节次1: {
        子节1: {
          主题1: {},
          主题2: {},
        },
        子节2: {},
      },
      节次2: {},
    },
    章节2: {},
  },
  篇目2: {},
}
```

2. 编辑 ~/stores/book.ts

```js
import book from '~/assets/books/book.js'

export const useBookStore = defineStore('book', () => {
  const books = ref({
    临床医学: book,
  })
  return { books }
})
```
