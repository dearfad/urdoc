// 处理跨域时NUXT对于OPTIONS请求无响应
export default defineEventHandler((event) => {
  if (event.method === 'OPTIONS') {
    // For CORS preflight requests -> Optional
    // Response -> 204 No Content
    event.node.res.statusCode = 204
    event.node.res.statusMessage = 'No Content'

    // For CORS preflight requests -> Essential
    // return '' -> 200 OK
    return ''
  }
})
