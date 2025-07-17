export default function () {
  const stateStore = useStateStore()
  async function database(action: string, prompt: SystemPrompt | null, user: User | null) {
    return await $fetch('/prompt/database', {
      baseURL: stateStore.apiBaseUrl,
      method: 'POST',
      body: { action: action, prompt: prompt, user: user },
    })
  }
  return { database }
}
