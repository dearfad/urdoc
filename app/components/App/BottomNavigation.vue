<template>
  <div class="overflow-visible">
    <v-bottom-navigation :active="stateStore.isBottomNavigationShow" :elevation="4">
      <v-btn v-for="item in items" :key="item.name" :to="item.to" :disabled="item.disabled">
        <v-icon>{{ item.icon }}</v-icon>
        <span>{{ item.title }}</span>
      </v-btn>
    </v-bottom-navigation>
  </div>
</template>

<script setup>
const stateStore = useStateStore()
const items = ref([
  {
    name: 'case',
    icon: 'mdi-wrench-outline',
    title: '病例',
    to: '/cstar/case',
    disabled: false,
  },
  {
    name: 'story',
    icon: 'mdi-book-open-outline',
    title: '故事',
    to: '/cstar/story',
    disabled: false,
  },
  {
    name: 'test',
    icon: 'mdi-ab-testing',
    title: '问题',
    to: '/cstar/test',
    disabled: true,
  },
  {
    name: 'act',
    icon: 'mdi-account-outline',
    title: '问诊',
    to: '/cstar/act',
    disabled: true,
  },
  {
    name: 'rate',
    icon: 'mdi-star-outline',
    title: '评估',
    to: '/cstar/rate',
    disabled: true,
  },
])
</script>
