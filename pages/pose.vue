<template>
  <ClientOnly>
    <v-container class="text-center">
      <v-row>
        <v-col cols="12">
          <CommonCaseNavCard />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <h1>视频生成</h1>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <FaceShow />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-btn :loading="isLoading" @click="getPoseId">生成视频</v-btn>
          <pre>{{ caseStore.casePoseId }}</pre>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-btn :loading="isLoading" @click="getPose">获取视频</v-btn>
          <pre>{{ caseStore.casePose }}</pre>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <video v-if="caseStore.casePose" width="400" autoplay loop controls>
            <source :src="caseStore.casePose" type="video/mp4" />
            您的浏览器不支持 HTML5 视频播放器。
          </video>
        </v-col>
      </v-row>
    </v-container>
  </ClientOnly>
</template>
<script setup>
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
