<template>
  <v-sheet class="d-flex flex-column ga-4 mx-4">
    <v-btn
      size="x-large"
      class="font-weight-bold"
      elevation="4"
      rounded="lg"
      text="生成对话"
      :loading="isLoading"
      @click="generateDialogue"
    />
    <div>
      <audio v-if="recordStore.record.dialogue" autoplay controls class="w-100 my-2">
        <source :src="recordStore.record.dialogue" type="audio/mpeg" />
      </audio>
    </div>
  </v-sheet>
</template>

<script setup>
const isLoading = ref(false)
const recordStore = useRecordStore()
async function generateDialogue() {
  isLoading.value = true
  await recordStore.getDialogue()
  isLoading.value = false
}
</script>
