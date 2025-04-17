<template>
  <v-sheet class="px-4 my-3" elevation="4" rounded="lg">
    <v-text-field
      v-model="stateStore.customConfig[configType]"
      class="my-4"
      label="设定"
      variant="outlined"
      hide-details="auto"
      clearable
      density="comfortable"
      placeholder="多个要点请用空格隔开"
    />
  </v-sheet>
</template>

<script lang="ts" setup>
const { configType } = defineProps({
  configType: { type: String, required: true },
})
const stateStore = useStateStore()
</script>
