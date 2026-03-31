// /assets/books/types.ts

/**
 * 书籍元数据
 */
export interface BookMeta {
  bookName: string
  publishDate: string
  edition: number
  isbn: string
}

/**
 * 书籍内容节点（递归类型）
 */
export interface BookContentNode {
  [key: string]: BookContentNode | {}
}

/**
 * 书籍完整结构
 */
export interface Book {
  meta: BookMeta
  content: BookContentNode
}

/**
 * 书籍集合
 */
export interface BookCollection {
  [bookName: string]: Book
}
