<template>
  <div>
    <div v-if="stateStore.isRecordEdit">
      <StoryContentEdit />
    </div>
    <div v-else>
      <StoryContentMarkdown />
    </div>
  </div>
</template>

<script setup>
const stateStore = useStateStore()
</script>
