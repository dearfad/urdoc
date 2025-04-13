<template>
  <v-sheet class="d-flex flex-column w-100 w-md-75 mx-auto mb-16">
    <CommonSiteSelector />
    <CommonApiBaseUrlSelector />
  </v-sheet>
</template>

<script setup>
definePageMeta({
  title: '站点选择',
})
</script>
