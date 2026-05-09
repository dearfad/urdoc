export const useUserStore = defineStore('user', () => {
  // const isSignedIn = ref(false)
  // const session = ref()
  // const user = computed(() => session.value?.user ?? null)

  // 在 store 中使用 useSession 来同步 Clerk 状态
  // const { isLoaded, isSignedIn: clerkIsSignedIn, session: clerkSession } = useSession()
  // const { isLoaded, isSignedIn, user } = useUser()

  // 监听 Clerk 状态变化并同步到 store
  // watchEffect(() => {
  //   if (isLoaded.value) {
  //     isSignedIn.value = clerkIsSignedIn.value
  //     session.value = clerkSession.value
  //   }
  // })

  // return { isLoaded, isSignedIn, user }
  return {}
})
