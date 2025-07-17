<template>
  <div>
    <div v-if="stateStore.recordShowContent === 'markdown'">
      <CaseContentMarkdown />
    </div>
    <div v-if="stateStore.recordShowContent === 'edit'">
      <CaseContentEdit />
    </div>
    <div v-if="stateStore.recordShowContent === 'list'">
      <CaseContentList />
    </div>
  </div>
</template>

<script setup>
const stateStore = useStateStore()
</script>
