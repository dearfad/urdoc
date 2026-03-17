<template>
  <div>
    <div v-if="stateStore.recordShowContent === 'markdown'">
      <StoryContentMarkdown />
    </div>
    <div v-if="stateStore.recordShowContent === 'edit'">
      <StoryContentEdit />
    </div>
    <div v-if="stateStore.recordShowContent === 'list'">
      <CaseContentList />
    </div>
  </div>
</template>

<script setup>
const stateStore = useStateStore()
</script>
