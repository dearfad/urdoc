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
      async signUp(userData) {
        try {
          const response = await userApi.auth('signup', userData)
          if (response.error) {
            stateStore.appInfos.push('注册错误: ' + response.error.code)
          } else {
            user.value.id = response.data.user.id
            user.value.email = response.data.user.email
            const userProfile = await profile.insert(user.value)
            user.value.name = userProfile.name
          }
        } catch (error) {
          stateStore.appInfos.push('注册异常: ' + error)
        }
      },
      async signIn(userData) {
        try {
          const response = await userApi.auth('signin', userData)
          if (response.error) {
            stateStore.appInfos.push('登录错误: ' + response.error.code)
          } else {
            user.value.id = response.data.user.id
            user.value.email = response.data.user.email
            const userProfile = await profile.select(user.value)
            user.value.name = userProfile.name
          }
        } catch (error) {
          stateStore.appInfos.push('登录异常: ' + error)
        }
      },
      async signOut() {
        try {
          const response = await userApi.auth('signout')
          if (response.error) {
            stateStore.appInfos.push('退出登录错误: ' + response.error.code)
          } else {
            $reset()
          }
        } catch (error) {
          stateStore.appInfos.push('退出登录异常: ' + error)
        }
      },

      async deleteUser(userData) {
        try {
          const response = await userApi.auth('deleteuser', userData)
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
      async insert(userData) {
        try {
          const response = await userApi.profile('insert', userData)
          if (response.error) {
            stateStore.appInfos.push('创建用户错误: ' + response.error.code)
          } else {
            return response.data[0]
          }
        } catch (error) {
          stateStore.appInfos.push('创建用户异常: ' + error)
        }
      },
      async select(userData) {
        try {
          const response = await userApi.profile('select', userData)
          if (response.error) {
            stateStore.appInfos.push('获取用户错误: ' + response.error.code)
          } else {
            return response.data[0]
          }
        } catch (error) {
          stateStore.appInfos.push('获取用户异常: ' + error)
        }
      },
      async updateName(userData) {
        try {
          const response = await userApi.profile('updateName', userData)
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
