<template>
  <v-footer v-if="stateStore.isAppFooterShow" app class="py-2">
    <div class="d-flex mx-auto">
      <v-img :src="badgeSrc" width="auto" height="20" />
    </div>
  </v-footer>
</template>

<script setup>
const stateStore = useStateStore()
const badgeSrc = ref('')
onMounted(async () => {
  const data = await $fetch('/api/utils/commit')
  console.log(data)
  const beijingTime = new Date(data).toISOString().replace('Z', '+08:00')
  console.log(beijingTime)
  const formattedBeijingTime = beijingTime.split('T')[0].replace(/-/g, '--')
  console.log(formattedBeijingTime)
  badgeSrc.value = `https://img.shields.io/badge/${formattedBeijingTime}-虚拟病例研究平台-blue?style=social&logo=github`
})
</script>
