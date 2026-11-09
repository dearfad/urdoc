<template>
  <StoryContent
    type="discussion"
    :title="t('tabs.discussion')"
    icon="i-lucide-message-circle"
    depends-on="conversation"
  />
</template>

<script setup lang="ts">
const { t } = useI18n()
</script>
