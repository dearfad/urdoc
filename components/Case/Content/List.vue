<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-data-table
          v-model="selected"
          :headers="headers"
          :items="items"
          show-select
          select-strategy="single"
          items-per-page-text="每页显示数量"
          hide-no-data
        />
      </v-col>
    </v-row>
    <v-row class="justify-center">
      <v-col cols="6">
        <v-btn
          block
          size="x-large"
          class="font-weight-bold"
          text="读取病例"
          :loading="isLoading"
          @click="loadCase"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
const stateStore = useStateStore()
const items = ref([])
const isLoading = ref(false)
const headers = ref([
  { title: '索引', key: 'id' },
  { title: '书', key: 'book' },
  { title: '章', key: 'chapter' },
  { title: '节', key: 'section' },
  { title: '小节', key: 'subsection' },
  { title: '标签', key: 'casetag' },
  { title: '主诉', key: 'content.主诉' },
  { title: '公开', key: 'public' },
  { title: '已校验', key: 'validated' },
  { title: '平台', key: 'platform' },
  { title: '模型', key: 'model_name' },
  { title: '模型ID', key: 'model_id' },
])

const selected = ref()

watch(selected, () => {
  stateStore.appInfo = selected.value
})

async function loadCase() {
  isLoading.value = true
  const { data, error } = await $fetch('/api/case/list', {
    headers: useRequestHeaders(['cookie']),
  })
  if (error) {
    stateStore.appInfo = error
  } else {
    items.value = data
  }
  isLoading.value = false
}
</script>
