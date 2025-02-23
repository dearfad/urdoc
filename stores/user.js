export const useUserStore = defineStore(
  'user',
  () => {
    const stateStore = useStateStore()

    const user = reactive({
      id: '',
      name: '',
      email: '',
    })

    function $reset() {
      user.id = ''
      user.name = ''
      user.email = ''
    }

    async function createUser(id, email) {
      const { data, error } = await $fetch('/api/user/create', {
        method: 'POST',
        headers: useRequestHeaders(['cookie']),
        body: { id: id, name: email, email: email },
      })
      if (error) {
        stateStore.appInfo = error
      } else {
        user.id = data.id
        user.name = data.name
        user.email = data.email
      }
    }

    async function getUser(id) {
      const { data, error } = await $fetch('/api/user/profile', {
        method: 'POST',
        headers: useRequestHeaders(['cookie']),
        body: { id: id },
      })
      if (error) {
        stateStore.appInfo = error
      } else {
        user.id = data.id
        user.name = data.name
        user.email = data.email
      }
    }

    async function updateUser(name) {
      const { data, error } = await $fetch('/api/user/update', {
        method: 'POST',
        headers: useRequestHeaders(['cookie']),
        body: { id: user.id, name: name },
      })
      if (error) {
        stateStore.appInfo = error
      } else {
        user.name = data.name
      }
    }

    async function deleteUser() {
      const { error } = await $fetch('/api/user/delete', {
        method: 'POST',
        headers: useRequestHeaders(['cookie']),
        body: { id: user.id },
      })
      if (error) {
        stateStore.appInfo = error
      } else {
        $reset()
        stateStore.appInfo = '删除成功'
      }
    }

    return { user, $reset, createUser, getUser, updateUser, deleteUser }
  },
  {
    persist: true,
  }
)
