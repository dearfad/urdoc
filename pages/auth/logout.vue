<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="3" class="mx-auto">
        <v-btn size="large" block :loading="isSignOut" @click="signOut"> 退出 </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
const isSignOut = ref(false)
async function signOut() {
  isSignOut.value = true
  console.log(useRequestHeaders(['cookie']))
  const { error } = await $fetch('/api/auth/logout', {
    headers: useRequestHeaders(['cookie']),
  })
  if (error) {
    stateStore.appInfo = error
  }
  isSignOut.value = false
}
</script>
