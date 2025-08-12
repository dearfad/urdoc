<template>
  <v-footer v-if="stateStore.isAppFooterShow" app class="py-2">
    <div class="d-flex mx-auto">
      <v-img :src="badgeSrc" width="auto" height="20" />
    </div>
  </v-footer>
</template>

<script setup>
const stateStore = useStateStore()
const badgeSrc = ref(
  'https://img.shields.io/badge/2025-虚拟病例研究平台-blue?style=social&logo=github'
)
</script>
