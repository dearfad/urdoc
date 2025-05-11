<template>
  <v-footer v-if="stateStore.isAppFooterShow" app>
    <ClientOnly>
      <v-sheet class="mx-auto text-caption">
        {{ new Date().getFullYear() }} - 虚拟病例研究所 - Ver 20250511 - alpha
      </v-sheet></ClientOnly
    >
  </v-footer>
</template>

<script setup>
const stateStore = useStateStore()
</script>
