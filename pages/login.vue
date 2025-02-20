<template>
  <v-container class="pa-12">
    <v-row>
      <v-col cols="12" md="6" class="mx-auto">
        <v-text-field
          v-model="email"
          label="邮箱"
          variant="outlined"
          :disabled="user ? true : false"
      /></v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="6" class="mx-auto">
        <v-text-field
          v-model="password"
          label="密码"
          type="password"
          variant="outlined"
          :disabled="user ? true : false"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="3" class="mx-auto">
        <v-btn size="large" block :disabled="user ? true : false" @click="signInWithPassword"
          >登录</v-btn
        >
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="3" class="mx-auto">
        <v-btn size="large" block :disabled="user ? false : true" @click="signOut">退出</v-btn>
      </v-col>
    </v-row>
    <v-row v-if="user">
      <v-col cols="12" md="3" class="mx-auto text-center"> 当前登录：{{ user.email }} </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
const supabase = useSupabaseClient()
const email = ref('')
const password = ref('')
const stateStore = useStateStore()

const user = useSupabaseUser()

const signInWithPassword = async () => {
  const { error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  })
  if (error) {
    console.log(error.code)
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
  }
}

const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) {
    stateStore.appInfo = error
  }
}
</script>
