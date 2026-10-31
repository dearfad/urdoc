<template>
  <UCard
    :id="`component-story-${props.type}`"
    :ui="{
      root: 'border border-default flex min-h-0 flex-col',
      header: 'bg-elevated flex items-center py-2 ',
      body: 'py-0 sm:py-2 flex-1 overflow-y-auto min-h-0',
      footer: 'p-0 sm:p-0',
    }"
  >
    <template #header>
      <UButton :icon="props.icon" variant="ghost" disabled />
      <span class="font-bold">{{ props.title }}</span>
      <UBadge
        v-if="statusBadge"
        v-bind="statusBadge.attrs"
        :ui="statusBadge.ui"
        size="sm"
        class="ml-1.5"
      >
        {{ statusBadge.label }}
      </UBadge>
      <div class="ms-auto flex items-center gap-2">
        <div v-if="viewMode === 'content'" class="items-center md:flex hidden">
          <UTooltip text="Markdown 格式">
            <UButton
              icon="i-mdi-language-markdown"
              :variant="contentMode === 'markdown' ? 'soft' : 'ghost'"
              @click="contentMode = 'markdown'"
              class="rounded-r-none"
            />
          </UTooltip>
          <UTooltip text="纯文本格式">
            <UButton
              icon="i-mdi-alpha-t-box-outline"
              :variant="contentMode === 'text' ? 'soft' : 'ghost'"
              @click="contentMode = 'text'"
              class="rounded-l-none"
            />
          </UTooltip>
        </div>
        <div class="bg-border mx-0.5 h-5 w-0.5 hidden md:block" />
        <UPopover
          v-model:open="isMenuOpen"
          :dismissible="true"
          class="md:hidden"
          :ui="{ content: 'bg-default shadow-2xl rounded-xl ring border border-default' }"
        >
          <UButton icon="i-lucide-ellipsis-vertical" variant="ghost" size="sm" />
          <template #content>
            <div class="flex flex-col gap-1 p-1" @click="isMenuOpen = false">
              <UButton
                icon="i-lucide-file-plus-2"
                variant="ghost"
                :loading="isGenerating"
                :disabled="isLocked"
                @click="handleGenerate"
              >
                生成
              </UButton>
              <ButtonCapture :capture-id="captureId" label="截屏" />
              <ButtonClipboard :text="contentText" label="复制" />
              <ButtonAudio :text="contentText" label="朗读" />
              <ButtonEdit v-model="isEditing" :disabled="!hasContent" label="编辑" />
            </div>
          </template>
        </UPopover>
        <div class="hidden items-center gap-2 md:flex">
          <UTooltip :text="isLocked ? lockHint : '生成'">
            <UButton
              icon="i-lucide-file-plus-2"
              variant="ghost"
              :loading="isGenerating"
              :disabled="isLocked"
              @click="handleGenerate"
            />
          </UTooltip>
          <UTooltip text="截屏">
            <ButtonCapture :capture-id="captureId" />
          </UTooltip>
          <UTooltip text="复制">
            <ButtonClipboard :text="contentText" />
          </UTooltip>
          <UTooltip text="朗读">
            <ButtonAudio :text="contentText" />
          </UTooltip>
          <UTooltip text="编辑">
            <ButtonEdit v-model="isEditing" :disabled="!hasContent" />
          </UTooltip>
        </div>
      </div>
    </template>

    <template #default>
      <ClientOnly>
        <div
          v-if="!hasContent && storyStore.status === 'ready'"
          class="flex min-h-full flex-col items-center justify-center gap-6 px-4 py-16"
        >
          <div class="bg-muted rounded-full p-5">
            <UIcon :name="props.icon" class="text-muted size-10" />
          </div>
          <p class="text-muted text-center">
            {{ isLocked ? lockHint : `尚未生成${props.title}，点击下方按钮开始` }}
          </p>
          <UButton
            :icon="props.icon"
            :loading="isGenerating"
            :disabled="isLocked"
            @click="handleGenerate"
          >
            {{ isLocked ? '请先完成上游内容' : `生成${props.title}` }}
          </UButton>
        </div>
        <div v-else>
          <EditorText
            v-if="isEditing && hasContent"
            v-model="contentModel"
          />
          <div v-else>
            <UChatReasoning
              v-if="subContent.reasoning"
              :text="subContent.reasoning"
              defaultOpen
              :ui="{ body: 'max-h-none pt-2' }"
              class="pt-2"
            >
              <Markdown
                :value="subContent.reasoning"
                class="*:first:mt-0 *:last:mb-0"
              />
            </UChatReasoning>
            <div
              v-if="contentMode === 'text'"
              class="whitespace-pre-wrap leading-relaxed"
            >
              {{ subContent.content }}
            </div>
            <Markdown v-else :value="subContent.content" />
          </div>
        </div>
      </ClientOnly>
    </template>
  </UCard>
</template>

<script setup lang="ts">
const props = defineProps({
  type: { type: String as () => 'conversation' | 'discussion' | 'comment', required: true },
  title: { type: String, required: true },
  icon: { type: String, required: true },
  dependsOn: { type: String as () => 'story' | 'conversation' | 'discussion', default: undefined },
})

const storyStore = useStoryStore()

const captureId = `component-story-${props.type}`
const isMenuOpen = ref(false)
const isEditing = ref(false)
const contentMode = ref('markdown')

const subContent = computed(() => {
  if (props.type === 'conversation') return storyStore.conversation
  if (props.type === 'discussion') return storyStore.discussion
  return storyStore.comment
})

const hasContent = computed(() => !!subContent.value.content)

const contentText = computed(() => subContent.value.content ?? '')

const contentModel = computed({
  get: () => subContent.value.content ?? '',
  set: (val: string) => {
    subContent.value.content = val
  },
})

const isGenerating = computed(() => {
  return (
    storyStore.currentType === `story-${props.type}` &&
    (storyStore.status === 'submitted' || storyStore.status === 'streaming')
  )
})

const isLocked = computed(() => {
  if (!props.dependsOn) return false
  if (props.dependsOn === 'story') return !storyStore.story.content
  if (props.dependsOn === 'conversation') return !storyStore.conversation.content
  if (props.dependsOn === 'discussion') return !storyStore.discussion.content
  return false
})

const lockHint = computed(() => {
  if (props.dependsOn === 'story') return '请先生成故事'
  if (props.dependsOn === 'conversation') return '请先生成对话'
  if (props.dependsOn === 'discussion') return '请先生成讨论'
  return '请先完成上游内容'
})

const viewMode = ref('content')

const statusBadge = computed(() => {
  const busy = isGenerating.value
  if (busy) {
    return {
      label: '生成中',
      attrs: { color: 'info' as const, variant: 'soft' as const },
      ui: { leadingIcon: 'animate-spin' },
    }
  }
  if (!hasContent.value) {
    return { label: '待生成', attrs: { color: 'neutral' as const, variant: 'soft' as const } }
  }
  return { label: '已生成', attrs: { color: 'success' as const, variant: 'soft' as const } }
})

function handleGenerate() {
  if (isLocked.value) return
  const method = (`generate${props.type.charAt(0).toUpperCase()}${props.type.slice(1)}`) as
    | 'generateConversation'
    | 'generateDiscussion'
    | 'generateComment'
  storyStore[method]()
}
</script>
