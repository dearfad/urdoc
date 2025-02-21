<template>
  <v-container class="pa-12">
    <v-row>
      <v-col cols="12" md="3" class="mx-auto">
        <v-text-field v-model="email" label="邮箱" variant="outlined"
      /></v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="3 " class="mx-auto">
        <v-text-field v-model="password" label="密码" type="password" variant="outlined" />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="3" class="mx-auto">
        <v-btn size="large" block :loading="isSignIn" @click="signInWithPassword"> 登录 </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="3" class="mx-auto">
        <v-btn size="large" block :loading="isSignOut" @click="signOut"> 退出 </v-btn>
      </v-col>
    </v-row>
    {{ userStore.user }}
    <!-- <v-btn block text="getUser" @click="getUser" />
    <div>user: {{ user }}</div>
    <v-row v-if="user">
      <v-col cols="12" md="3" class="mx-auto text-center"> 当前登录：{{ user.email }} </v-col>
    </v-row> -->
  </v-container>
</template>

<script setup>
const email = ref('')
const password = ref('')
const isSignIn = ref(false)
const isSignOut = ref(false)
const stateStore = useStateStore()
const userStore = useUserStore()
// const user = ref()

// async function getUser() {
//   user.value = useSupabaseUser()
// }

async function signInWithPassword() {
  isSignIn.value = true
  const { data, error } = await $fetch('/api/auth/login', {
    method: 'POST',
    headers: useRequestHeaders(['cookie']),
    body: { email: email.value, password: password.value },
  })
  if (error) {
    switch (error.code) {
      case 'invalid_credentials':
        stateStore.appInfo = '认证失败：登录凭证无效'
        break
      case 'validation_failed':
        stateStore.appInfo = '认证失败：请填写邮箱和密码'
        break
      default:
        stateStore.appInfo = error
    }
  } else {
    userStore.user = data
  }
  isSignIn.value = false
}

async function signOut() {
  isSignOut.value = true
  const { error } = await $fetch('/api/auth/logout', {
    headers: useRequestHeaders(['cookie']),
  })
  if (error) {
    stateStore.appInfo = error
  }
  isSignOut.value = false
}
</script>
