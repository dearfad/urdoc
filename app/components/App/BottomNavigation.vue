<template>
  <v-bottom-navigation :active="stateStore.isBottomNavigationShow" :elevation="0">
    <v-btn to="/cstar/case">
      <v-icon>mdi-wrench-outline</v-icon>
      <span>病例</span>
    </v-btn>

    <v-btn to="/cstar/story">
      <v-icon>mdi-book-open-outline</v-icon>
      <span>故事</span>
    </v-btn>

    <v-btn to="/cstar/test" :disabled="true">
      <v-icon>mdi-ab-testing</v-icon>
      <span>问题</span>
    </v-btn>

    <v-btn to="/cstar/act" :disabled="true">
      <v-icon>mdi-account-outline</v-icon>
      <span>问诊</span>
    </v-btn>

    <v-btn to="/cstar/rate" :disabled="true">
      <v-icon>mdi-shield-star-outline</v-icon>
      <span>评价</span>
    </v-btn>
  </v-bottom-navigation>
</template>

<script setup>
const stateStore = useStateStore()
</script>
