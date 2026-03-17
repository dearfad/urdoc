<template>
  <v-card
    hover
    class="text-body-1 px-4 py-2 overflow-auto"
    rounded="lg"
    height="55vh"
    :loading="isLoading"
  >
    <v-data-table
      v-model="id"
      :headers="headers"
      :items="stateStore.listRecords"
      show-select
      select-strategy="single"
      items-per-page="6"
      items-per-page-text="每页显示数量"
      :items-per-page-options="[6, 7, 10, 20, 50, 100, -1]"
      hide-no-data
      density="compact"
      mobile-breakpoint="md"
    />
    <v-sheet class="d-flex justify-end">
      <div>
        <v-btn text="刷新" variant="plain" @click="selectAll()" />
      </div>
      <div>
        <v-btn text="读取" variant="plain" @click="selectRecord()" />
      </div>
      <v-dialog max-width="400">
        <template #activator="{ props: activatorProps }">
          <v-btn variant="plain" text="删除" class="font-weight-bold" v-bind="activatorProps" />
        </template>
        <template #default="{ isActive }">
          <v-card title="确认删除">
            <v-card-text> 本操作将在数据库中删除该条记录，是否继续？ </v-card-text>

            <v-card-actions>
              <v-spacer />
              <v-btn text="取消" @click="isActive.value = false" />
              <v-btn text="确认" @click=";(isActive.value = false), deleteRecord()" />
            </v-card-actions>
          </v-card>
        </template>
      </v-dialog>
    </v-sheet>
  </v-card>
</template>

<script setup>
const stateStore = useStateStore()
const recordStore = useRecordStore()
const id = ref([])
const isLoading = ref(false)
const headers = ref([
  { title: '索引', key: 'id', nowrap: true, width: 90 },
  { title: '姓名', key: 'record.case.姓名', nowrap: true, width: 90 },
  { title: '性别', key: 'record.case.性别', nowrap: true, width: 90 },
  { title: '年龄', key: 'record.case.年龄', nowrap: true, width: 90 },
  { title: '主诉', key: 'record.case.主诉', nowrap: true },
  { title: '教科书', key: 'record.scope.book', nowrap: true },
  { title: '章节', key: 'record.scope.chapter', nowrap: true },
])

async function selectAll() {
  isLoading.value = true
  await recordStore.database.selectAll()
  isLoading.value = false
}
async function selectRecord() {
  isLoading.value = true
  const record = {
    id: id.value[0],
  }
  await recordStore.database.select(record)
  isLoading.value = false
}

async function deleteRecord() {
  isLoading.value = true
  const record = {
    id: id.value[0],
  }
  await recordStore.database.delete(record)
  isLoading.value = false
}
</script>
