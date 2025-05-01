<template>
  <div>
    <div v-if="stateStore.recordShowContent === 'markdown'">
      <TestContentMarkdown />
    </div>
    <div v-if="stateStore.recordShowContent === 'edit'">
      <TestContentEdit />
    </div>
  </div>
</template>

<script setup>
const stateStore = useStateStore()
</script>
