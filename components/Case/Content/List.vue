<template>
  <v-sheet
    class="text-body-1 px-5 py-2 mx-4 my-2 overflow-auto"
    elevation="4"
    rounded="lg"
    height="55vh"
  >
    <v-data-table
      v-model="stateStore.listSelectedRecordId"
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
        <v-btn text="刷新" variant="plain" @click="recordStore.list()" />
      </div>
      <div>
        <v-btn text="读取" variant="plain" @click="recordStore.load()" />
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
              <v-btn text="确认" @click=";(isActive.value = false), recordStore.remove()" />
            </v-card-actions>
          </v-card>
        </template>
      </v-dialog>
    </v-sheet>
  </v-sheet>
</template>

<script setup>
const stateStore = useStateStore()
const recordStore = useRecordStore()
const headers = ref([
  { title: '索引', key: 'id', nowrap: true, width: 90 },
  { title: '姓名', key: '姓名', nowrap: true, width: 90 },
  { title: '性别', key: '性别', nowrap: true, width: 90 },
  { title: '年龄', key: '年龄', nowrap: true, width: 90 },
  { title: '主诉', key: '主诉', nowrap: true },
])
</script>
