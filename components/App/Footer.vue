<template>
  <v-footer v-if="stateStore.isAppFooterShow" app class="py-2">
    <div class="d-flex mx-auto ga-4">
      <v-img
        src="https://img.shields.io/badge/2025--05--13-虚拟病例研究平台-blue?style=social&logo=github"
        width="auto"
        height="20"
      />
    </div>
  </v-footer>
</template>

<script setup>
const stateStore = useStateStore()
</script>
