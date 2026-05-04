<template>
  <!-- <v-sheet class="d-flex flex-column w-100 w-md-66 mx-auto my-4 px-2 ga-4">
    <CommonRecordTools />
    <ActContentShow />
    <ActUtilsChat />
  </v-sheet> -->
  <UDashboardPanel id="pages-cstar-act">
    <template #header>
      <UDashboardNavbar title="互动实践">
        <template #leading>
          <UTooltip text="侧边栏">
            <UDashboardSidebarCollapse />
          </UTooltip>
        </template>
      </UDashboardNavbar>
      <UDashboardToolbar />
    </template>
    <template #body>
      <!-- <CardCase /> -->
    </template>
  </UDashboardPanel>
</template>

<script setup>
definePageMeta({
  title: '互动实践',
})
</script>
