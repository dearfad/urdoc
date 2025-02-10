export default defineEventHandler(async () => {
  const runtimeConfig = useRuntimeConfig()
  console.log(runtimeConfig.testApiKey)
  return 'api OK'
})
