<template>
  <v-card hover class="px-4" rounded="lg">
    <v-select
      v-model="item"
      label="提示词"
      :items="items"
      item-title="title"
      variant="outlined"
      hide-details="auto"
      prepend-inner-icon="mdi-file-word-box-outline"
      density="comfortable"
      class="mt-4"
      return-object
      no-data-text="读取后可选择"
      @update:model-value="handlePromptChange"
    />
    <v-card-actions>
      <v-btn text="编辑" @click="isEdit = !isEdit" />
      <v-spacer />
      <v-btn text="读取" @click="handlePromptList" />
      <v-btn text="新建" @click="handlePromptCreate" />
      <v-btn v-if="item.id ? false : true" text="保存" @click="handlePromptInsert" />
      <v-btn v-if="item.id ? true : false" text="更新" @click="handlePromptupdate" />

      <v-dialog max-width="400">
        <template #activator="{ props: activatorProps }">
          <v-btn text="删除" :disabled="item.id ? false : true" v-bind="activatorProps" />
        </template>
        <template #default="{ isActive }">
          <v-card title="确认删除">
            <v-card-text> 本操作将在数据库中删除该条记录，是否继续？ </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn text="取消" @click="isActive.value = false" />
              <v-btn text="确认" @click=";(isActive.value = false), handlePromptDelete()" />
            </v-card-actions>
          </v-card>
        </template>
      </v-dialog>
    </v-card-actions>
    <v-expand-transition>
      <div v-if="isEdit">
        <v-text-field v-model="item.id" variant="outlined" label="id" disabled="true" />
        <v-text-field v-model="item.type" variant="outlined" label="类型" disabled="true" />
        <v-text-field v-model="item.title" variant="outlined" label="标题" />
        <v-textarea v-model="item.prompt" variant="outlined" label="内容" auto-grow />
      </div>
    </v-expand-transition>
  </v-card>
</template>

<script setup>
const { usage } = defineProps({
  usage: { type: String, required: true },
})
const isEdit = ref(false)
const promptStore = usePromptStore()
const stateStore = useStateStore()
const item = ref(promptStore.prompts.system[usage])
const items = computed(() => promptStore.prompts.user[usage])

async function handlePromptList() {
  await promptStore.managePrompt('list')
  if (items.value.length != 0) {
    item.value = promptStore.prompts.user[usage][0]
    handlePromptChange()
  }
}

function handlePromptCreate() {
  item.value = {
    id: 0,
    type: usage,
    title: '新建',
    prompt: '',
  }
}

async function handlePromptInsert() {
  const insertPrompt = {
    type: usage,
    title: item.value.title,
    prompt: item.value.prompt,
  }
  await promptStore.managePrompt('insert', insertPrompt)
  await promptStore.managePrompt('list')
}

async function handlePromptupdate() {
  const updatePrompt = {
    id: item.value.id,
    type: usage,
    title: item.value.title,
    prompt: item.value.prompt,
  }
  await promptStore.managePrompt('update', updatePrompt)
  await promptStore.managePrompt('list')
}
async function handlePromptDelete() {
  if ([1, 2, 3, 4, 5].includes(promptStore.prompts.system[usage].id)) {
    stateStore.appInfos.push('默认提示词不能删除')
  } else {
    await promptStore.managePrompt('delete', promptStore.prompts.system[usage])
    await promptStore.managePrompt('list')
  }
}
function handlePromptChange() {
  if (items.value.length != 0) promptStore.prompts.system[usage] = item.value
}
</script>
