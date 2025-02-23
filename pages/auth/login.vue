<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="6" class="mx-auto">
        <v-text-field v-model="email" label="邮箱" variant="outlined"
      /></v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="6" class="mx-auto">
        <v-text-field v-model="password" label="密码" type="password" variant="outlined" />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="6" class="mx-auto">
        <v-btn
          size="large"
          block
          :loading="isSignIn"
          :disabled="userStore.user.id ? true : false"
          @click="signInWithPassword"
        >
          登录
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
const email = ref('')
const password = ref('')
const isSignIn = ref(false)

const stateStore = useStateStore()
const userStore = useUserStore()

async function signInWithPassword() {
  isSignIn.value = true
  const { data, error } = await $fetch('/api/auth/login', {
    method: 'POST',
    headers: useRequestHeaders(['cookie']),
    body: { email: email.value, password: password.value },
  })
  if (error) {
    stateStore.appInfo = error
  } else {
    await userStore.getUser(data.user.id)
  }
  isSignIn.value = false
}
</script>
