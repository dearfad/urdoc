<template>
  <v-card hover class="px-4" rounded="lg" :loading="isLoading">
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
        {{ item }}
        <v-text-field v-model="item.id" variant="outlined" label="id" :disabled="true" />
        <v-text-field v-model="item.type" variant="outlined" label="类型" :disabled="true" />
        <v-text-field v-model="item.title" variant="outlined" label="标题" />
        <v-textarea v-model="item.prompt" variant="outlined" label="内容" auto-grow />
        <v-text-field v-model="item.author" variant="outlined" label="作者" :disabled="true" />
        <v-switch v-model="item.public" label="公开" color="primary" />
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

const isLoading = ref(false)

async function handlePromptList() {
  isLoading.value = true
  await promptStore.managePrompt('list')
  isLoading.value = false
  if (items.value.length != 0) {
    item.value = promptStore.prompts.user[usage][0]
  }
}

function handlePromptCreate() {
  item.value = {
    id: 0,
    type: usage,
    title: '新建',
    prompt: '',
    author: '',
    public: true,
  }
  isEdit.value = true
}

async function handlePromptInsert() {
  isLoading.value = true
  const insertPrompt = {
    type: usage,
    title: item.value.title,
    prompt: item.value.prompt,
    author: '',
    public: item.value.public,
  }
  const response = await promptStore.managePrompt('insert', insertPrompt)
  promptStore.prompts.user[usage].push(response[0])
  item.value = response[0]
  isLoading.value = false
}

async function handlePromptupdate() {
  const updatePrompt = {
    id: item.value.id,
    type: usage,
    title: item.value.title,
    prompt: item.value.prompt,
  }
  isLoading.value = true
  const response = await promptStore.managePrompt('update', updatePrompt)
  promptStore.prompts.user[usage] = promptStore.prompts.user[usage].map((item) =>
    item.id === response[0].id ? { ...item, ...response } : item
  )
  isLoading.value = false
}
async function handlePromptDelete() {
  isLoading.value = true
  if ([1, 2, 3, 4, 5].includes(promptStore.prompts.system[usage].id)) {
    stateStore.appInfos.push('默认提示词不能删除')
  } else {
    const response = await promptStore.managePrompt('delete', promptStore.prompts.system[usage])
    promptStore.prompts.user[usage] = promptStore.prompts.user[usage].filter(
      (item) => item.id !== response[0].id
    )
    if (item.value.id === response[0].id) {
      item.value = promptStore.prompts.user[usage][0]
    }
  }
  isLoading.value = false
}

watch(
  () => item.value,
  (newVal) => {
    if (items.value.length != 0) {
      promptStore.prompts.system[usage] = newVal
    }
  },
  { deep: true }
)
</script>
