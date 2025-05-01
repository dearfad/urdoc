<template>
  <div>
    <div v-if="stateStore.recordShowContent === 'markdown'">
      <StoryContentMarkdown />
    </div>
    <div v-if="stateStore.recordShowContent === 'edit'">
      <StoryContentEdit />
    </div>
  </div>
</template>

<script setup>
const stateStore = useStateStore()
</script>
