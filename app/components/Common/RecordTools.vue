<template>
  <v-card
    class="d-flex justify-space-between font-weight-bold mx-4"
    hover
    rounded="lg"
    :loading="isLoading"
  >
    <v-btn-toggle v-model="stateStore.recordShowContent" mandatory density="compact">
      <v-btn text="查看" :value="'markdown'" />
      <v-btn text="编辑" :value="'edit'" />
    </v-btn-toggle>
    <div class="ml-auto">
      <v-btn
        variant="plain"
        text="浏览"
        class="font-weight-bold"
        @click="stateStore.recordShowContent = 'list'"
      />
    </div>
    <div v-if="recordStore.record.id">
      <v-btn variant="plain" text="更新" class="font-weight-bold" @click="update()" />
    </div>
    <div v-else>
      <v-btn variant="plain" text="保存" class="font-weight-bold" @click="insert()" />
    </div>
  </v-card>
</template>

<script setup>
const stateStore = useStateStore()
const recordStore = useRecordStore()
const userStore = useUserStore()
const isLoading = ref(false)

async function insert() {
  if (!userStore.isSignedIn) {
    stateStore.appInfos.push('非注册用户无法保存')
    return
  }
  isLoading.value = true
  const recordData = {
    record: recordStore.record,
    author: userStore.user.username,
    public: recordStore.record.public,
  }
  await recordStore.database.insert(recordData)
  isLoading.value = false
}

async function update() {
  isLoading.value = true
  const recordData = {
    id: recordStore.record.id,
    record: {
      case: recordStore.record.case,
      story: recordStore.record.story,
      test: recordStore.record.test,
      scope: recordStore.record.scope,
      tag: recordStore.record.tag,
    },
    public: recordStore.record.public,
  }
  await recordStore.database.update(recordData)
  isLoading.value = false
}
</script>
