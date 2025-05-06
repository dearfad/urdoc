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

    const auth = {
      async login(userData) {
        try {
          const response = await userApi.auth('login', userData)
          if (response.error) {
            stateStore.appInfos.push('登录错误: ' + response.error)
          } else {
            const { id, email } = response.data.user
            user.value.id = id
            user.value.email = email
            await profile.retrieve(user.value)
          }
        } catch (error) {
          stateStore.appInfos.push('登录异常: ' + error)
        }
      },
      async logout() {
        try {
          const response = await userApi.auth('logout')
          if (response.error) {
            stateStore.appInfos.push('退出登录错误: ' + response.error)
          } else {
            $reset()
          }
        } catch (error) {
          stateStore.appInfos.push('退出登录异常: ' + error)
        }
      },
      async register(userData) {
        try {
          const response = await userApi.auth('register', userData)
          if (response.error) {
            stateStore.appInfos.push('注册错误: ' + response.error.code)
          } else {
            user.value.id = response.data.user.id
            user.value.email = response.data.user.email
            await profile.create(user.value)
          }
        } catch (error) {
          stateStore.appInfos.push('注册异常: ' + error)
        }
      },
      async remove(userData) {
        try {
          const response = await userApi.auth('delete', userData)
          if (response.error) {
            stateStore.appInfos.push('注销错误: ' + response.error.code)
          } else {
            $reset()
          }
        } catch (error) {
          stateStore.appInfos.push('注销异常: ' + error)
        }
      },
    }

    const profile = {
      async create(userData) {
        try {
          const response = await userApi.profile('create', userData)
          if (response.error) {
            stateStore.appInfos.push('创建用户错误: ' + response.error.code)
          } else {
            user.value.name = response.data[0].name
          }
        } catch (error) {
          stateStore.appInfos.push('创建用户异常: ' + error)
        }
      },
      async retrieve(userData) {
        try {
          const response = await userApi.profile('retrieve', userData)
          if (response.error) {
            stateStore.appInfos.push('获取用户错误: ' + response.error.code)
          } else {
            user.value.name = response.data[0].name
          }
        } catch (error) {
          stateStore.appInfos.push('获取用户异常: ' + error)
        }
      },
      async update(userData) {
        try {
          const response = await userApi.profile('update', userData)
          if (response.error) {
            stateStore.appInfos.push('更新用户错误: ' + response.error.code)
          } else {
            user.value.name = response.data[0].name
          }
        } catch (error) {
          stateStore.appInfos.push('更新用户异常: ' + error)
        }
      },
    }

    return { user, $reset, auth, profile }
  },
  {
    persist: true,
  }
)
