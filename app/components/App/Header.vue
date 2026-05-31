<template>
  <div>
    <UTooltip text="主题">
      <UColorModeButton />
    </UTooltip>
    <UTooltip text="文档">
      <UButton
        to="/docs"
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
  </div>
</template>
