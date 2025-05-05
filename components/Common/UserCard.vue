<template>
  <v-sheet>
    <v-card v-if="userStore.user.id" hover class="px-4" rounded="lg" :loading="isLoading">
      <template #title>
        <div class="my-2">昵称: {{ userStore.user.name || '' }}</div>
      </template>
      <template #subtitle
        ><div class="my-2">邮箱: {{ userStore.user.email || '' }}</div>
      </template>
      <template #text> ID: {{ userStore.user.id || '' }} </template>
      <v-card-actions>
        <v-spacer />
        <v-btn text="退出" @click="handleLogout" />
      </v-card-actions>
    </v-card>
    <v-card v-else hover class="px-4" rounded="lg" :loading="isLoading">
      <v-text-field v-model="email" label="邮箱" variant="outlined" class="mt-6" />
      <v-text-field
        v-model="password"
        label="密码"
        type="password"
        variant="outlined"
        class="mt-2"
      />
      <v-card-actions>
        <v-spacer />
        <v-btn size="large" @click="handleRegister"> 注册 </v-btn>
        <v-btn size="large" @click="handleLogin"> 登录 </v-btn>
      </v-card-actions>
    </v-card>
  </v-sheet>
</template>

<script setup>
const isLoading = ref(false)
const email = ref('')
const password = ref('')
const userStore = useUserStore()

async function handleLogout() {
  isLoading.value = true
  await userStore.auth('logout')
  isLoading.value = false
}

async function handleLogin() {
  isLoading.value = true
  const user = {
    id: '',
    email: email.value,
    password: password.value,
    name: '',
  }
  await userStore.auth('login', user)
  isLoading.value = false
}

async function handleRegister() {
  isLoading.value = true
  const user = {
    id: '',
    email: email.value,
    password: password.value,
    name: '',
  }
  await userStore.auth('register', user)
  isLoading.value = false
}
</script>
