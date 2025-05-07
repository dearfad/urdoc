<template>
  <v-sheet class="ma-4">
    <v-card
      v-if="userStore.user.id"
      hover
      class="d-flex flex-column pa-4 ga-4"
      rounded="lg"
      :loading="isLoading"
    >
      <v-text-field
        v-model="userStore.user.name"
        label="昵称"
        variant="outlined"
        hide-details="auto"
      />
      <v-btn text="更改昵称" block size="large" class="mb-2" @click="handleUpdateName" />
      <v-text-field
        v-model="userStore.user.email"
        label="邮箱"
        variant="outlined"
        disabled
        hide-details="auto"
      />
      <v-text-field
        v-model="userStore.user.id"
        label="ID"
        variant="outlined"
        disabled
        hide-details="auto"
      />
      <v-card-actions>
        <v-spacer />
        <v-btn text="退出" @click="handleLogout" />
        <v-dialog max-width="400">
          <template #activator="{ props: activatorProps }">
            <v-btn text="注销" v-bind="activatorProps" color="error" />
          </template>
          <template #default="{ isActive }">
            <v-card title="确认注销">
              <v-card-text> 本操作将在数据库中删除用户，是否继续？ </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn text="取消" @click="isActive.value = false" />
                <v-btn text="确认" @click=";(isActive.value = false), handleRemoveUser()" />
              </v-card-actions>
            </v-card>
          </template>
        </v-dialog>
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
  await userStore.auth.logout()
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
  await userStore.auth.login(user)
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
  await userStore.auth.register(user)
  isLoading.value = false
}

async function handleRemoveUser() {
  isLoading.value = true
  await userStore.auth.remove(userStore.user)
  isLoading.value = false
}

async function handleUpdateName() {
  isLoading.value = true
  const user = {
    id: userStore.user.id,
    email: userStore.user.email,
    name: userStore.user.name,
  }
  await userStore.profile.update(user)
  isLoading.value = false
}
</script>
