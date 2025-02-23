<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="6" class="mx-auto">
        <v-text-field v-model="name" label="昵称" variant="outlined"
      /></v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="6" class="mx-auto">
        <v-btn size="large" block :loading="isUpdate" @click="updateName"> 更改 </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
const name = ref('')
const isUpdate = ref(false)
const userStore = useUserStore()
async function updateName() {
  isUpdate.value = true
  await userStore.updateUser(name.value)
  isUpdate.value = false
}
</script>

<style></style>
