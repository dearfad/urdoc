<template>
  <v-sheet class="d-flex flex-column mx-4">
    <v-btn
      size="x-large"
      class="font-weight-bold my-5"
      elevation="4"
      rounded="lg"
      text="生成头像"
      :loading="isLoading"
      @click="getFace"
    />
  </v-sheet>
</template>

<script lang="ts" setup>
const isLoading = ref(false)
const caseStore = useCaseStore()
const modelRouter = useModelRouter()

async function getFace() {
  isLoading.value = true
  caseStore.caseFaceUrl = await modelRouter.getFaceUrl()
  isLoading.value = false
}
</script>
