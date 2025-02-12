export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  console.log(query)
  return 'api OK'
})
