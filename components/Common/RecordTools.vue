<template>
  <v-sheet
    class="d-flex justify-space-between font-weight-bold mx-4 my-2"
    elevation="4"
    rounded="lg"
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
      <v-btn variant="plain" text="更新" class="font-weight-bold" @click="recordStore.update" />
    </div>
    <div v-else>
      <v-btn variant="plain" text="保存" class="font-weight-bold" @click="recordStore.insert" />
    </div>
  </v-sheet>
</template>

<script setup>
const stateStore = useStateStore()
const recordStore = useRecordStore()
</script>
