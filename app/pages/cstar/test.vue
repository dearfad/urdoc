<template>
  <!-- <v-sheet class="d-flex flex-column w-100 w-md-66 mx-auto my-4 px-2 ga-4">
    <CommonRecordTools />
    <TestContentShow />
    <TestUtilsGenerate />
  </v-sheet> -->
  <UDashboardPanel id="pages-cstar-test">
    <template #header>
      <UDashboardNavbar title="考核理论">
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
  title: '考核理论',
})
</script>
