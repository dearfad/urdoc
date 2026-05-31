---
title: '自定义教科书'
description: '支持 assets/books/book.ts 自动导入'
---

## 自定义教科书

在 `assets/books/book.ts` 中定义教科书目录结构，定义后会自动导入到病例生成的教科书选择中。

### 数据结构

以下示例展示了一本教科书的完整目录结构：

```ts
// assets/books/book.ts

const book: Book = {
  meta: {
    bookName: '内科学', // 书籍名称
    publishDate: '2024-07', // 出版时间
    edition: 10, // 版次
    isbn: '978-7-117-36571-0', // 国际标准书号
  },
  content: {
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
  },
}

export default book
```

### 结构说明

- **meta** — 书籍元信息，包括名称、出版时间、版次和 ISBN
- **content** — 目录树，层级结构为：篇目 → 章节 → 节次 → 子节 → 主题
- 每个层级的键名为该层级的内容名称，叶子节点（主题）的值为空对象 `{}`
- 文件放在 `assets/books/` 目录下会自动被系统识别
