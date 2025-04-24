<template>
  <div>
    <div v-if="stateStore.isRecordEdit">
      <TestContentEdit />
    </div>
    <div v-else>
      <TestContentMarkdown />
    </div>
  </div>
</template>

<script setup>
const stateStore = useStateStore()
</script>
