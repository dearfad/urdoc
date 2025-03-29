export default defineEventHandler((event) => {
  if (event.method === 'OPTIONS') {
    event.node.res.statusCode = 200
    event.node.res.statusMessage = 'OK'
    // return ''
  }
})
