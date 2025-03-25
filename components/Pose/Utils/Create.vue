<template>
  <v-sheet class="d-flex flex-column mx-4">
    <v-btn
      size="x-large"
      class="font-weight-bold my-5"
      elevation="4"
      rounded="lg"
      text="生成视频"
      :loading="isLoading"
      @click="getPoseId"
    />
    <pre>{{ caseStore.casePoseId }}</pre>
    <v-btn
      size="x-large"
      class="font-weight-bold my-5"
      elevation="4"
      rounded="lg"
      text="获取视频"
      :loading="isLoading"
      @click="getPose"
    />
    <pre>{{ caseStore.casePose }}</pre>
  </v-sheet>
</template>

<script lang="ts" setup>
const isLoading = ref(false)
const caseStore = useCaseStore()
const modelRouter = useModelRouter()

async function getPoseId() {
  isLoading.value = true
  caseStore.casePoseId = await modelRouter.getPoseId()
  isLoading.value = false
}

async function getPose() {
  isLoading.value = true
  caseStore.casePose = await modelRouter.getPose()
  isLoading.value = false
}
</script>
