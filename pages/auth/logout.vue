<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="6" class="mx-auto">
        <v-btn size="large" block :loading="isSignOut" @click="signOut"> 退出 </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
const isSignOut = ref(false)

const stateStore = useStateStore()
const userStore = useUserStore()

async function signOut() {
  isSignOut.value = true
  const { error } = await $fetch('/api/auth/logout', {
    method: 'GET',
    headers: useRequestHeaders(['cookie']),
  })
  if (error) {
    stateStore.appInfo = error
  } else {
    userStore.$reset()
  }
  isSignOut.value = false
}
</script>
