<template>
  <v-sheet class="d-flex flex-column">
    <v-btn
      disabled
      size="x-large"
      class="font-weight-bold"
      hover
      rounded="lg"
      text="模型校验"
      :loading="isLoading"
      @click="check"
    />
  </v-sheet>
</template>

<script setup>
const isLoading = ref(false)
const recordStore = useRecordStore()
async function check() {
  isLoading.value = true
  await recordStore.checkCase()
  isLoading.value = false
}
</script>
