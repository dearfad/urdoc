<template>
  <v-card hover rounded="lg">
    <v-tabs v-model="tab" bg-color="grey-lighten-3">
      <v-tab text="范围" value="scope" />
      <v-tab text="模型" value="model" />
      <v-tab text="其他" value="other" />
    </v-tabs>

    <v-divider />

    <v-tabs-window v-model="tab">
      <v-tabs-window-item value="scope">
        <CommonScopeSelector />
      </v-tabs-window-item>
      <v-tabs-window-item value="model">
        <ModelCard model-type="all" model-usage="all" />
      </v-tabs-window-item>
      <v-tabs-window-item value="other">
        <v-sheet class="pa-5" color="brown">Three</v-sheet>
      </v-tabs-window-item>
    </v-tabs-window>
  </v-card>
</template>

<script setup>
const tab = ref('scope')
</script>
