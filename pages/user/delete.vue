<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="6" class="mx-auto">
        <v-btn size="large" block :loading="isDelete" @click="deleteUser"> 删除用户 </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
const isDelete = ref(false)
const userStore = useUserStore()
const stateStore = useStateStore()
async function deleteUser() {
  isDelete.value = true
  await userStore.deleteUser()
  const { error } = await $fetch('/api/auth/logout', {
    method: 'GET',
    headers: useRequestHeaders(['cookie']),
  })
  if (error) {
    stateStore.appInfo = error
  } else {
    userStore.$reset()
  }
  isDelete.value = false
}
</script>
