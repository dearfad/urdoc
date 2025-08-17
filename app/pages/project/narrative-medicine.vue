<template>
  <v-container fluid class="w-100 w-md-75">
    <v-row>
      <v-col cols="12" class="d-flex flex-column">
        <v-menu :close-on-content-click="false">
          <template #activator="{ props }">
            <v-btn v-bind="props"> 选择疾病范围 </v-btn>
          </template>
          <CommonScopeSelector />
        </v-menu>
        <div class="px-4 py-1 border-dotted border-thin border-t-0">
          <v-chip-group>
            <v-chip
              v-if="stateStore.scope.book"
              prepend-icon="mdi-book-open-variant-outline"
              variant="outlined"
            >
              {{ stateStore.scope.book }}
            </v-chip>
            <v-chip
              v-if="stateStore.scope.part"
              prepend-icon="mdi-bookmark-multiple-outline"
              variant="outlined"
            >
              {{ stateStore.scope.part }}
            </v-chip>
            <v-chip
              v-if="stateStore.scope.chapter"
              prepend-icon="mdi-bookmark-multiple-outline"
              variant="outlined"
            >
              {{ stateStore.scope.chapter }}
            </v-chip>
            <v-chip
              v-if="stateStore.scope.section"
              prepend-icon="mdi-book-outline"
              variant="outlined"
            >
              {{ stateStore.scope.section }}
            </v-chip>
            <v-chip
              v-if="stateStore.scope.subsection"
              prepend-icon="mdi-bookmark-outline"
              variant="outlined"
            >
              {{ stateStore.scope.subsection }}
            </v-chip>
            <v-chip
              v-if="stateStore.scope.topic"
              prepend-icon="mdi-bookmark-outline"
              variant="outlined"
            >
              {{ stateStore.scope.topic }}
            </v-chip>
          </v-chip-group>
        </div>
        <v-btn block text="开始生成" :loading="isLoading" @click="generate">
          <template #loader>
            <v-progress-circular indeterminate color="white" class="mr-4" />
            {{ field }}
          </template></v-btn
        >
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="3">
        <FaceContentShow height="" />
      </v-col>
      <v-col cols="12" md="9" class="d-flex flex-column ga-4">
        <CaseContentMarkdown height="" />
        <StoryContentMarkdown height="" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
definePageMeta({
  title: '叙事医学',
})
const stateStore = useStateStore()
const recordStore = useRecordStore()
const isLoading = ref(false)
const field = ref('')

async function generate() {
  isLoading.value = true
  stateStore.recordShowContent = 'markdown'
  stateStore.isCaseModelResponseStringShow = true
  field.value = '生成病例...'
  await recordStore.getCase()
  stateStore.isCaseModelResponseStringShow = false
  stateStore.isStoryModelResponseStringShow = true
  field.value = '生成故事...'
  await recordStore.getStory()
  stateStore.isStoryModelResponseStringShow = false
  field.value = '生成面部...'
  await recordStore.getFace()
  isLoading.value = false
}
</script>
