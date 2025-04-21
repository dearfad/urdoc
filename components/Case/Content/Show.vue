<template>
  <div>
    <div v-if="stateStore.isRecordEdit">
      <CaseContentEdit />
    </div>
    <div v-else>
      <CaseContentMarkdown />
    </div>
  </div>
</template>

<script setup>
const stateStore = useStateStore()
</script>
