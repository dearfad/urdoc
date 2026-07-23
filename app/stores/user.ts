export const useUserStore = defineStore('user', () => {
  const { isLoaded, isSignedIn, user } = useUser()

  const role = computed(() => (user.value?.publicMetadata?.role as string) ?? 'user')
  const isAdmin = computed(() => role.value === 'admin')

  return { isLoaded, isSignedIn, user, role, isAdmin }
})
