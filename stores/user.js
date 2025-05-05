export const useUserStore = defineStore(
  'user',
  () => {
    const stateStore = useStateStore()
    const userApi = useUserApi()

    const user = ref({
      id: '',
      name: '',
      email: '',
    })

    function $reset() {
      user.value.id = ''
      user.value.name = ''
      user.value.email = ''
    }

    async function auth(action, userData = null) {
      let response
      try {
        switch (action) {
          case 'login':
            {
              response = await userApi.auth('login', userData)
              if (response.error) {
                stateStore.appInfos.push('登录错误: ' + response.error)
              } else {
                user.value.id = response.data.user.id
                user.value.email = response.data.user.email
              }
            }
            break
          case 'logout':
            {
              response = await userApi.auth('logout')
              if (response.error) {
                stateStore.appInfos.push('登出错误: ' + response.error)
              } else {
                user.value.id = ''
                user.value.email = ''
              }
            }
            break
          case 'register':
            {
              response = await userApi.auth('register', userData)
              if (response.error) {
                stateStore.appInfos.push('注册错误: ' + response.error.code)
              } else {
                user.value.id = response.data.user.id
                user.value.email = response.data.user.email
              }
            }
            break
        }
      } catch (error) {
        stateStore.appInfos.push('错误: ' + error.message)
      }
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

    return { user, $reset, createUser, getUser, updateUser, deleteUser, auth }
  },
  {
    persist: true,
  }
)
