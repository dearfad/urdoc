<template>
  <v-sheet v-if="stateStore.isDebug" class="d-flex flex-column w-100 w-md-75 mx-auto mb-16">
    <v-sheet
      class="text-body-1 pa-5 mx-4 my-2 overflow-auto"
      elevation="4"
      rounded="lg"
      height="60vh"
    >
      <v-textarea
        v-model="stateStore.modelResponseString"
        label="模型响应解析文字"
        rows="1"
        auto-grow
        variant="outlined"
      />
      <v-textarea
        v-model="stateStore.modelResponseStream"
        label="模型响应数据流"
        rows="1"
        auto-grow
        variant="outlined"
      />
    </v-sheet>
  </v-sheet>
</template>

<script setup>
const stateStore = useStateStore()
</script>
