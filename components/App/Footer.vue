<template>
  <v-footer app>
    <ClientOnly>
      <v-sheet class="mx-auto text-caption">
        {{ new Date().getFullYear() }} - 虚拟病例研究所 - Ver 20250401 - Multi
        <span class="font-weight-bold">{{ userStore.user ? userStore.user.name : '访客' }}</span>
      </v-sheet>
    </ClientOnly>
  </v-footer>
</template>

<script setup>
const userStore = useUserStore()
</script>
