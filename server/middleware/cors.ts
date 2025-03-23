export default defineEventHandler(async (event) => {
  event.node.res.setHeader('Access-Control-Allow-Origin', '*') // 允许所有来源访问
  event.node.res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  event.node.res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
})
