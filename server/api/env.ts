export default defineEventHandler(async (event) => {
  return useRuntimeConfig(event)
})
