<template>
  <div>
    <UTooltip :text="t('header.theme')">
      <UColorModeButton />
    </UTooltip>
    <UTooltip :text="t('header.docs')">
      <UButton
        :to="localePath('/docs')"
        icon="i-lucide-file-text"
        :aria-label="t('header.docs')"
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
    <AppLocaleSwitch size="md" />
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
</script>
