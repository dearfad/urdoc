<template>
  <v-bottom-navigation :active="stateStore.isBottomNavigationShow">
    <v-btn value="recent">
      <v-icon>mdi-history</v-icon>

      <span>病例</span>
    </v-btn>

    <v-btn value="favorites">
      <v-icon>mdi-heart</v-icon>

      <span>故事</span>
    </v-btn>

    <v-btn value="nearby">
      <v-icon>mdi-map-marker</v-icon>

      <span>问题</span>
    </v-btn>
    <v-btn value="nearby">
      <v-icon>mdi-map-marker</v-icon>

      <span>问诊</span>
    </v-btn>
    <v-btn value="nearby">
      <v-icon>mdi-map-marker</v-icon>

      <span>评价</span>
    </v-btn>
  </v-bottom-navigation>
</template>

<script setup>
const stateStore = useStateStore()
</script>
