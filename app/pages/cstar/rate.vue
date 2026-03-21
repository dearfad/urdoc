<template>
  <!-- <v-sheet class="d-flex flex-column w-100 w-md-66 mx-auto my-4 px-2 ga-4">
    <CommonRecordTools />
    <RateContentShow />
    <RateUtilsChat />
  </v-sheet> -->
  <UDashboardPanel id="pages-cstar-rate">
    <template #header>
      <UDashboardNavbar title="评估能力">
        <template #leading>
          <UTooltip text="侧边栏">
            <UDashboardSidebarCollapse />
          </UTooltip>
        </template>
      </UDashboardNavbar>
      <UDashboardToolbar />
    </template>
    <template #body>
      <CardCase />
    </template>
  </UDashboardPanel>
</template>

<script setup>
definePageMeta({
  title: '评估能力',
})
</script>
