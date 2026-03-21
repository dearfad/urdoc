<template>
  <UDashboardPanel id="pages-dashboard-index">
    <template #header>
      <UDashboardNavbar title="概览">
        <template #leading>
          <UTooltip text="侧边栏">
            <UDashboardSidebarCollapse />
          </UTooltip>
        </template>

        <template #right>
          <UTooltip text="主题">
            <UColorModeButton />
          </UTooltip>
          <UTooltip text="文档">
            <UButton
              to="https://docs.urdoc.dearfad.com"
              target="_blank"
              icon="i-lucide-file-text"
              aria-label="Documentation"
              color="neutral"
              variant="ghost"
            />
          </UTooltip>
          <UTooltip text="GitHub">
            <UButton
              to="https://github.com/dearfad/urdoc"
              target="_blank"
              icon="i-simple-icons-github"
              aria-label="GitHub"
              color="neutral"
              variant="ghost"
            />
          </UTooltip>
        </template>
      </UDashboardNavbar>
    </template>
    <template #body> This is the dashboard overview page. You can add your content here. </template>
  </UDashboardPanel>
</template>
