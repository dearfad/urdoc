export default function () {
  const stateStore = useStateStore()
  async function database(action: string, prompt: SystemPrompt | null) {
    return await $fetch('/prompt/database', {
      baseURL: stateStore.apiBaseUrl,
      method: 'POST',
      body: { action: action, prompt: prompt },
    })
  }
  return { database }
}
