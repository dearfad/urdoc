export default function () {
  const stateStore = useStateStore()
  async function auth(action: string, user: User) {
    return await $fetch('/user/auth', {
      baseURL: stateStore.apiBaseUrl,
      method: 'POST',
      headers: useRequestHeaders(['cookie']),
      body: { action: action, user: user },
      credentials: 'include',
    })
  }

  async function profile(action: string, user: User) {
    return await $fetch('/user/profile', {
      baseURL: stateStore.apiBaseUrl,
      method: 'POST',
      headers: useRequestHeaders(['cookie']),
      body: { action: action, user: user },
    })
  }

  return { auth, profile }
}
