<template>
  <v-sheet elevation="2" class="ma-2">
    <ClientOnly>
      <v-card
        v-if="caseStore.caseContent"
        :title="caseStore.caseContent.姓名"
        :subtitle="caseStore.caseContent.主诉"
        prepend-icon="mdi-human-female"
        variant="text"
      >
        <template #prepend>
          <v-avatar size="150" rounded="circle">
            <v-img :src="caseStore.caseFace" @click="showFace" />
          </v-avatar>
        </template>
        <template #append>
          <v-chip v-if="stateStore.id" variant="elevated" size="small">病例库</v-chip>
          <v-chip v-if="stateStore.validated" variant="elevated" size="small" color="green"
            >已校验</v-chip
          >
        </template>
        <v-card-text class="pb-0">
          <CommonCaseTag />
        </v-card-text>
      </v-card>
    </ClientOnly>
    <v-sheet class="pa-2">
      <v-btn text="病历" to="/cstar/case" variant="text" />
      <v-btn text="故事" to="/cstar/story" variant="text" />
      <v-btn text="问题" to="/cstar/test" variant="text" />
      <v-btn text="问诊" to="/cstar/act" variant="text" />
      <v-btn text="评估" to="/cstar/rate" variant="text" />
    </v-sheet>
  </v-sheet>
</template>

<script setup>
const caseStore = useCaseStore()
const stateStore = useStateStore()

function showFace() {
  window.open(caseStore.caseFace, '_blank')
}
</script>
