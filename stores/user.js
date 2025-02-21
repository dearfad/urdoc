export const useUserStore = defineStore(
  'user',
  () => {
    const user = ref()
    return { user }
  },
  {
    persist: true,
  }
)
