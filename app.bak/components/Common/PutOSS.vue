<template>
  <v-btn
    size="x-large"
    class="font-weight-bold"
    elevation="4"
    rounded="lg"
    text="保存到OSS"
    @click="recordStore.saveAvatar()"
  />
</template>

<script setup>
const recordStore = useRecordStore()
</script>
