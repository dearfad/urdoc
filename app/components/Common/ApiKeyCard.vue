<template>
  <v-card hover class="px-4" rounded="lg" :isloading="isLoading">
    <v-select
      v-model="apiKeyName"
      label="Api Keys"
      :items="apiKeyNames"
      item-title="name"
      item-value="value"
      variant="outlined"
      class="my-4"
      hide-details="auto"
      density="comfortable"
      no-data-text="暂无可用密钥"
    />
    <v-card-actions>
      <v-btn text="管理" @click="isExpandShow = !isExpandShow" />
      <v-btn text="删除" @click="delApiKey" />
    </v-card-actions>
    <v-expand-transition>
      <div v-if="isExpandShow" class="d-flex flex-column ga-2">
        <v-text-field
          v-model="newApiKeyName"
          variant="outlined"
          label="名称"
          hint="密钥名称，如有同名则覆盖就密钥"
        />
        <v-text-field
          v-model="newApiKey"
          variant="outlined"
          label="密钥"
          hint="密钥值，加密后保存在本地"
        />
        <v-card-actions density="compact">
          <v-btn text="添加" @click="addApiKey" />
        </v-card-actions>
      </div>
    </v-expand-transition>
  </v-card>
</template>

<script setup>
const apiKeyStore = useApiKeyStore()
const isLoading = ref(false)
const isExpandShow = ref(false)

const apiKeyNames = computed(() => Object.keys(apiKeyStore.apiKeys))
const apiKeyName = ref(apiKeyNames.value.length > 0 ? apiKeyNames.value[0] : '')

const newApiKey = ref('')
const newApiKeyName = ref('')

async function addApiKey() {
  isLoading.value = true
  await apiKeyStore.add(newApiKeyName.value, newApiKey.value)
  isLoading.value = false
  isExpandShow.value = false
}

function delApiKey() {
  const keyToDelete = apiKeyName.value
  if (!(keyToDelete in apiKeyStore.apiKeys)) return
  // 用对象展开 + computed keys 过滤掉要删除的 key
  apiKeyStore.apiKeys = Object.fromEntries(
    Object.entries(apiKeyStore.apiKeys).filter(([key]) => key !== keyToDelete)
  )
  // 更新当前选中
  const names = Object.keys(apiKeyStore.apiKeys)
  apiKeyName.value = names.length ? names[0] : ''
}
</script>
