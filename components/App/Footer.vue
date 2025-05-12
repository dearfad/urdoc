<template>
  <v-footer v-if="stateStore.isAppFooterShow" app class="py-2">
    <div class="d-flex mx-auto ga-4">
      <v-img
        src="https://img.shields.io/badge/2025-%E8%99%9A%E6%8B%9F%E7%97%85%E4%BE%8B%E7%A0%94%E7%A9%B6%E5%B9%B3%E5%8F%B0-black?style=social&logo=github"
        width="auto"
        height="20"
      />
      <v-img
        src="https://img.shields.io/github/package-json/v/dearfad/urdoc?style=social&label=%E7%89%88%E6%9C%AC%E5%8F%B7"
        width="auto"
        height="20"
      />
    </div>
  </v-footer>
</template>

<script setup>
const stateStore = useStateStore()
</script>
