<template>
  <v-tabs v-model="tab" align-tabs="center" density="compact">
    <v-tab value="show" text="显示" />
    <v-tab value="edit" text="更改" />
    <v-tab value="database" text="存取" />
  </v-tabs>
  <v-tabs-window v-model="tab">
    <v-tabs-window-item value="show">
      <CaseContentMarkdown />
    </v-tabs-window-item>
    <v-tabs-window-item value="edit">
      <CaseContentEdit />
    </v-tabs-window-item>
    <v-tabs-window-item value="database">
      <CaseContentDatabase />
    </v-tabs-window-item>
  </v-tabs-window>
</template>

<script setup>
const tab = ref('')
</script>
