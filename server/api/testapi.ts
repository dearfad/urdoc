export default defineEventHandler(async (event) => {
  console.log(event)
  const query = getQuery(event)
  console.log(query)
  return query
})
