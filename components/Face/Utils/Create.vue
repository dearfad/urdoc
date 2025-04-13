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
    >
      <template #loader>
        <v-progress-circular indeterminate color="white" class="mr-4" />
        {{ stateStore.modelResponseField }}
      </template>
    </v-btn>
    <CommonModelSelector model-type="images" model-usage="face" />
  </v-sheet>
</template>

<script lang="ts" setup>
const isLoading = ref(false)
const caseStore = useCaseStore()
const stateStore = useStateStore()
const modelRouter = useModelRouter()

async function getFace() {
  isLoading.value = true
  caseStore.caseFaceUrl = await modelRouter.getFace()
  isLoading.value = false
}
</script>
