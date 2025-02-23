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
          :loading="isSignUp"
          :disabled="userStore.user.id ? true : false"
          @click="signUpWithPassword"
        >
          注册
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
const email = ref('')
const password = ref('')
const isSignUp = ref(false)

const stateStore = useStateStore()
const userStore = useUserStore()

async function signUpWithPassword() {
  isSignUp.value = true
  const { data, error } = await $fetch('/api/auth/register', {
    method: 'POST',
    headers: useRequestHeaders(['cookie']),
    body: { email: email.value, password: password.value },
  })
  if (error) {
    stateStore.appInfo = error
  } else {
    await userStore.createUser(data.user.id, data.user.email)
  }
  isSignUp.value = false
}
</script>
