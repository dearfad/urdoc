<template>
  <v-img :src="imgUrl" class="mx-auto" rounded="xl" />
</template>

<script setup>
const recordStore = useRecordStore()
const imgUrl = computed(() => {
  if (recordStore.record.face) return recordStore.record.face
  return recordStore.record.case.性别 === '男' ? '/placeholder_male.png' : '/placeholder_female.png'
})
</script>
