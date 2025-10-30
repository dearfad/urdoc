<template>
  <v-card hover rounded="lg">
    <v-tabs v-model="tab" bg-color="grey-lighten-3">
      <v-tab text="范围" value="scope" />
      <v-tab text="模型" value="model" />
    </v-tabs>
    <v-tabs-window v-model="tab">
      <v-tabs-window-item value="scope">
        <CommonScopeSelector :is-title-show="false" />
      </v-tabs-window-item>
      <v-tabs-window-item value="model">
        <ModelCard :is-title-show="false" />
      </v-tabs-window-item>
    </v-tabs-window>
  </v-card>
</template>

<script setup>
const tab = ref('scope')
</script>
