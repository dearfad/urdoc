<template>
  <!-- <v-sheet class="d-flex flex-column w-100 w-md-66 mx-auto my-4 px-2 ga-4"> -->
  <!-- <CommonRecordTools /> -->
  <!-- <CaseContentShow /> -->
  <!-- <CaseUtilsGenerate /> -->
  <!-- <CaseUtilsCheck /> -->
  <!-- </v-sheet> -->

  <UDashboardPanel id="pages-cstar-case">
    <template #header>
      <UDashboardNavbar title="生成病例">
        <template #leading>
          <UTooltip text="侧边栏">
            <UDashboardSidebarCollapse />
          </UTooltip>
        </template>
      </UDashboardNavbar>
    </template>
    <template #body>
      <div class="flex flex-row flex-wrap gap-2">
        <Case class="basis-4xl" />
        <CaseSettings class="basis-xl" />
      </div>
    </template>
  </UDashboardPanel>
</template>

<script setup>
definePageMeta({
  title: '生成病例',
})
</script>
