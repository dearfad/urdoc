<template>
  <StoryContent
    type="conversation"
    :title="t('tabs.conversation')"
    icon="i-lucide-messages-square"
    depends-on="story"
  />
</template>

<script setup lang="ts">
const { t } = useI18n()
</script>
