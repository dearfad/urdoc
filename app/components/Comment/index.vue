<template>
  <StoryContent
    type="comment"
    :title="t('tabs.comment')"
    icon="i-lucide-star"
    depends-on="discussion"
  />
</template>

<script setup lang="ts">
const { t } = useI18n()
</script>
