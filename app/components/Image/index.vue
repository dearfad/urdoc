<template>
  <UCard
    id="component-image-index"
    :ui="{
      root: 'border border-default overflow-auto flex flex-col',
      header: 'bg-elevated flex items-center py-2',
      body: 'py-0 sm:py-2 flex-1 flex flex-col',
      footer: 'p-0 sm:p-0',
    }"
  >
    <template #header>
      <UButton icon="i-lucide-image" variant="ghost" to="/multimodal/image" />
      <span class="font-bold">图像创作</span>
      <div class="ms-auto flex gap-2">
        <ButtonGenerate type="image" :task="activeTab" :label="headerButtonLabel" />
      </div>
    </template>

    <template #default>
      <UTabs v-model="activeTab" :items="tabs" variant="link" class="w-full shrink-0" default-value="generate">
        <template #generate>
          <div class="flex flex-col gap-3 p-4">
            <UInput
              v-model="imageStore.prompt"
              size="xl"
              placeholder="描述你想要生成的图片，例如：一只戴帽子的猫在月光下弹钢琴"
            />
          </div>
        </template>
        <template #face>
          <div class="flex flex-col gap-2 p-4">
            <p class="text-sm text-muted">
              基于当前 <NuxtLink to="/cstar/case" class="text-primary underline">病例</NuxtLink>
              生成患者肖像。AI 将从病例中提取关键体征特征，生成医学影像风格的肖像。
            </p>
            <ButtonGenerate type="image" task="face" label="生成患者头像" />
          </div>
        </template>
        <template #illustration>
          <div class="flex flex-col gap-2 p-4">
            <p class="text-sm text-muted">
              基于当前 <NuxtLink to="/cstar/story" class="text-primary underline">故事</NuxtLink>
              生成 4 张故事插图。AI 将先把故事分解为关键场景，再逐一生成对应插图。
            </p>
            <ButtonGenerate type="image" task="illustration" label="生成故事插图" />
          </div>
        </template>
      </UTabs>

      <div class="flex-1 border-t border-default">
        <div v-if="imageStore.status === 'streaming'" class="flex items-center justify-center p-8">
          <USkeleton class="h-64 w-full max-w-lg rounded-lg" />
        </div>
        <div v-else-if="imageStore.error" class="flex items-center justify-center p-8">
          <p class="text-sm text-error">{{ imageStore.error }}</p>
        </div>
        <div v-else-if="imageStore.images.length" class="p-4">
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div
              v-for="(img, i) in imageStore.images"
              :key="i"
              class="group relative overflow-hidden rounded-lg border border-default"
            >
              <img
                :src="img.url"
                :alt="`生成图片 ${i + 1}`"
                class="w-full object-cover"
              />
            </div>
          </div>
        </div>
        <div v-else class="flex items-center justify-center p-8">
          <p class="text-sm text-muted">选择任务并输入描述，然后点击「生成图像」</p>
        </div>
      </div>
    </template>

    <template #footer />
  </UCard>
</template>

<script setup lang="ts">
const imageStore = useImageStore()

const activeTab = ref('generate')

const headerButtonLabel = computed(() => {
  const map: Record<string, string> = {
    generate: '生成图像',
    face: '生成患者头像',
    illustration: '生成故事插图',
  }
  return map[activeTab.value] || '生成'
})

const tabs = [
  { label: '自定义生成', value: 'generate', icon: 'i-lucide-pencil', slot: 'generate' },
  { label: '生成头像', value: 'face', icon: 'i-lucide-user', slot: 'face' },
  { label: '故事插图', value: 'illustration', icon: 'i-lucide-book-image', slot: 'illustration' },
]
</script>
