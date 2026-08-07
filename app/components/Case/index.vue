<template>
  <UCard
    id="component-case-index"
    :ui="{
      root: 'border border-default flex min-h-0 flex-1 flex-col',
      header: 'bg-elevated flex items-center py-2 ',
      body: 'py-0 sm:py-2 flex-1 overflow-y-auto min-h-0',
      footer: 'p-0 sm:p-0',
    }"
  >
    <template v-if="props.showHeader" #header>
      <UButton icon="i-mdi-alpha-c-circle" variant="ghost" to="/cstar/case" />
      <span class="font-bold">病历</span>
      <UBadge
        v-if="verifyBadge"
        v-bind="verifyBadge.attrs"
        :ui="verifyBadge.ui"
        size="sm"
        class="ml-1.5"
      >
        {{ verifyBadge.label }}
      </UBadge>
      <div v-if="props.showActions" class="ms-auto flex items-center gap-2">
        <div v-if="viewMode === 'content'" class="flex items-center">
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
        <div class="bg-border mx-0.5 h-5 w-0.5" />
        <CaseToolbar
          v-if="viewMode !== 'verify'"
          :is-generating="isGenerating"
          :has-content="!!caseStore.case?.content"
          :markdown="caseStore.markdown"
          capture-id="component-case-index"
          v-model:editing="isEditing"
          @generate="caseStore.generate()"
          @toggle-settings="$emit('toggleSettings')"
          @verify="handleVerify"
        />
        <template v-if="viewMode === 'verify'">
          <UTooltip text="关闭校验">
            <UButton
              icon="i-lucide-x"
              variant="ghost"
              size="sm"
              @click="viewMode = 'content'"
            />
          </UTooltip>
          <UTooltip text="再次校验">
            <UButton
              icon="i-lucide-rotate-ccw"
              variant="ghost"
              size="sm"
              :loading="isVerifying"
              @click="handleReverify"
            />
          </UTooltip>
          <UTooltip v-if="!isVerifyPassed" text="自动更正">
            <UButton
              icon="i-lucide-wand-sparkles"
              variant="ghost"
              color="primary"
              size="sm"
              :loading="caseStore.currentType === 'case-fix'"
              :disabled="caseStore.currentType === 'case-fix'"
              @click="handleAutoFix"
            />
          </UTooltip>
          <UTooltip text="手动更正">
            <UButton
              icon="i-lucide-pencil"
              variant="ghost"
              size="sm"
              @click="handleEdit"
            />
          </UTooltip>
        </template>
      </div>
    </template>
    <template #default>
      <ClientOnly>
        <div
          v-if="!caseStore.case?.content && caseStore.status === 'ready'"
          class="flex min-h-full flex-col items-center justify-center gap-6 px-4 py-16"
        >
          <div class="bg-muted rounded-full p-5">
            <UIcon name="i-lucide-stethoscope" class="text-muted size-10" />
          </div>
          <p class="text-muted text-center">尚未生成病历，点击下方按钮开始</p>
          <ButtonGenerate type="case" task="generate" label="生成病例" />
        </div>
        <div v-else>
          <EditorObject
            v-if="isEditing && caseStore.case?.content"
            v-model="caseStore.case.content"
          />
          <div v-else-if="viewMode === 'verify'">
            <div
              v-if="!caseStore.verifyResult"
              class="text-muted flex items-center justify-center gap-2 py-8"
            >
              <UIcon
                v-if="isVerifying"
                name="i-lucide-loader-circle"
                class="size-5 animate-spin"
              />
              <span>{{ isVerifying ? '正在校验...' : '准备校验...' }}</span>
            </div>
            <template v-else>
              <UChatReasoning
                v-if="caseStore.verifyReasoning"
                :text="caseStore.verifyReasoning ?? undefined"
                defaultOpen
                :ui="{ body: 'max-h-none pt-2' }"
                class="pt-2"
              >
                <Markdown
                  :value="caseStore.verifyReasoning"
                  class="*:first:mt-0 *:last:mb-0"
                />
              </UChatReasoning>

              <div class="space-y-6 px-1 sm:px-2 pb-4 pt-3">
                <template
                  v-for="section in parsedVerifySections"
                  :key="section.heading"
                >
                  <div class="border-b border-default pb-1.5">
                    <span class="text-muted text-base font-semibold tracking-wider">{{
                      cleanHeading(section.heading)
                    }}</span>
                  </div>
                  <template v-if="section.type === 'conclusion'">
                    <div
                      v-if="getConclusionText(section)"
                      class="rounded-md border border-default border-l-4 px-4 py-3"
                      :class="conclusionBorder(section)"
                    >
                      <div class="flex items-center justify-between">
                        <span class="text-muted text-base font-medium">校验结论</span>
                        <span
                          class="text-base font-semibold"
                          :class="conclusionTextClass(section)"
                        >{{ getConclusionText(section) }}</span>
                      </div>
                    </div>
                  </template>
                  <template v-else>
                    <Markdown
                      :value="section.content"
                      class="*:first:mt-0 *:last:mb-0"
                    />
                  </template>
                </template>
              </div>
            </template>
          </div>
          <div v-else>
            <UChatReasoning
              v-if="stateStore.case.isReasoning"
              :text="caseStore.case.reasoning ?? undefined"
              defaultOpen
              :ui="{ body: 'max-h-none pt-2' }"
              class="pt-2"
            >
              <Markdown
                :value="caseStore.case.reasoning"
                class="*:first:mt-0 *:last:mb-0"
              />
            </UChatReasoning>
            <div
              v-if="contentMode === 'text'"
              class="whitespace-pre-wrap leading-relaxed"
            >
              {{ textContent }}
            </div>
            <Markdown v-else :value="filteredMarkdown" />
          </div>
        </div>
      </ClientOnly>
    </template>

    <template #footer>
      <div
        v-if="isFooterVisible"
        class="mx-4 my-2 flex min-h-7 flex-wrap gap-2"
      >
          <UBadge
            v-for="sourceItem in filteredTextbookItems"
            :key="sourceItem.name"
          :icon="sourceItem.icon"
          variant="soft"
          color="neutral"
          size="lg"
        >
          {{ caseStore.case.textbook?.content?.[sourceItem.name] }}
        </UBadge>
        <UBadge
          v-for="custom in caseStore.case.custom"
          :key="custom"
          variant="soft"
          color="neutral"
          size="lg"
          icon="i-lucide-pencil"
        >
          {{ custom }}
        </UBadge>
      </div>
    </template>
  </UCard>
</template>

<script setup lang="ts">
const props = defineProps({
  settingsVisible: { type: Boolean, default: true },
  showFooter: { type: Boolean, default: undefined },
  showActions: { type: Boolean, default: true },
  showHeader: { type: Boolean, default: true },
  contentInclude: { type: Array, default: undefined },
  contentExclude: { type: Array, default: undefined },
  mode: { type: String, default: 'markdown' },
})
defineEmits(['toggleSettings'])

const caseStore = useCaseStore()
const stateStore = useStateStore()

const isFooterVisible = computed(() => {
  return props.showFooter !== undefined ? props.showFooter : stateStore.showCaseFooter
})
const textbookItems = ref([
  { icon: 'i-lucide-book', name: 'book' },
  { icon: 'i-lucide-bookmark', name: 'part' },
  { icon: 'i-lucide-table-of-contents', name: 'chapter' },
  { icon: 'i-lucide-book-marked', name: 'section' },
  { icon: 'i-lucide-book-open', name: 'subsection' },
  { icon: 'i-lucide-notepad-text', name: 'topic' },
])

const filteredTextbookItems = computed(() => {
  return textbookItems.value.filter((item) => caseStore.case.textbook?.content?.[item.name])
})

const isGenerating = computed(() => caseStore.status === 'submitted' || caseStore.status === 'streaming')

const isVerifying = computed(() => {
  return (
    caseStore.currentType === 'case-verify' &&
    (caseStore.status === 'submitted' || caseStore.status === 'streaming')
  )
})

const isFixing = computed(() => {
  return (
    caseStore.currentType === 'case-fix' &&
    (caseStore.status === 'submitted' || caseStore.status === 'streaming')
  )
})

const filteredContent = computed(() => {
  const content = caseStore.case.content
  if (!content) return null
  let entries = Object.entries(content)
  if (props.contentInclude?.length) {
    const set = new Set(props.contentInclude)
    entries = entries.filter(([k]) => set.has(k))
  }
  if (props.contentExclude?.length) {
    const set = new Set(props.contentExclude)
    entries = entries.filter(([k]) => !set.has(k))
  }
  return Object.fromEntries(entries)
})

const filteredMarkdown = computed(() => {
  if (!filteredContent.value) return ''
  return Object.entries(filteredContent.value)
    .map(([k, v]) => `**${k}**：${v}`)
    .join('\n\n')
})

const textContent = computed(() => {
  const content = filteredContent.value
  if (!content) return ''

  const firstFields = ['姓名', '性别', '年龄', '主诉']
  const firstParts = firstFields
    .filter(k => content[k])
    .map(k => content[k])

  let result = firstParts.join('，') + '。'

  const removeLabel = new Set(['现病史', '既往史'])
  const excludeFields = new Set(['专科查体'])

  const remaining = Object.entries(content)
    .filter(([k]) => !firstFields.includes(k))
    .filter(([k]) => !excludeFields.has(k))
    .filter(([, v]) => v && v !== '无')
    .map(([k, v]) => {
      const value = v.endsWith('。') ? v : v + '。'
      if (removeLabel.has(k)) return value
      return `${k} ${value}`
    })

  if (remaining.length > 0) {
    result += remaining.join(' ')
  }

  return result
})

const isEditing = ref(false)
const contentMode = ref(props.mode)

const verifyBadge = computed(() => {
  const ct = caseStore.currentType
  const busy = caseStore.status === 'submitted' || caseStore.status === 'streaming'
  const spin = { icon: 'i-lucide-loader-circle', color: 'info' as const, variant: 'soft' as const }

  if (ct === 'case' && busy) {
    return { label: '生成中', attrs: { ...spin }, ui: { leadingIcon: 'animate-spin' } }
  }
  if (ct === 'case-verify' && busy) {
    return { label: '校验中', attrs: { ...spin }, ui: { leadingIcon: 'animate-spin' } }
  }
  if (ct === 'case-fix' && busy) {
    return { label: '修改中', attrs: { ...spin }, ui: { leadingIcon: 'animate-spin' } }
  }

  if (!caseStore.case?.content) return null

  if (!caseStore.verifyResult) {
    return { label: '未校验', attrs: { color: 'neutral' as const, variant: 'soft' as const } }
  }
  if (isVerifyPassed.value) {
    return { label: '已校验', attrs: { color: 'success' as const, variant: 'soft' as const } }
  }
  return { label: '未通过', attrs: { color: 'warning' as const, variant: 'soft' as const } }
})
const viewMode = ref('content')

interface VerifySection {
  heading: string
  content: string
  type: 'analysis' | 'issues' | 'conclusion'
}

function detectSectionType(heading: string): VerifySection['type'] {
  if (/逐项分析/.test(heading)) return 'analysis'
  if (/问题汇总/.test(heading)) return 'issues'
  if (/校验结论/.test(heading)) return 'conclusion'
  return 'analysis'
}

function parseVerifySections(markdown: string): VerifySection[] {
  const sections: VerifySection[] = []
  const lines = markdown.split('\n')
  let currentHeading = ''
  let currentLines: string[] = []

  for (const line of lines) {
    if (line.startsWith('### ')) {
      if (currentHeading) {
        sections.push({
          heading: currentHeading,
          content: currentLines.join('\n').trim(),
          type: detectSectionType(currentHeading),
        })
      }
      currentHeading = line.slice(4).trim()
      currentLines = []
    } else {
      currentLines.push(line)
    }
  }

  if (currentHeading) {
    sections.push({
      heading: currentHeading,
      content: currentLines.join('\n').trim(),
      type: detectSectionType(currentHeading),
    })
  }

  for (const section of sections) {
    section.content = section.content.replace(/^---\s*[\n\r]/, '').replace(/[\n\r]---\s*$/, '')
  }

  return sections
}

const parsedVerifySections = computed(() => {
  return parseVerifySections(caseStore.verifyResult || '')
})

function cleanHeading(heading: string): string {
  const text = heading.replace(/[\u{1F000}-\u{1FFFF}]/gu, '').trim()
  if (/^[一二三]、/.test(text)) return text
  const labels: Record<string, string> = {
    analysis: '一、逐项分析',
    issues: '二、问题汇总',
    conclusion: '三、校验结论',
  }
  return labels[detectSectionType(text)] || text
}

function getConclusionText(section: VerifySection): string {
  const match = section.content.match(/\*\*(.+?)\*\*/)
  return match?.[1]?.trim() ?? ''
}

function conclusionBorder(section: VerifySection): string {
  const text = getConclusionText(section)
  if (text === '通过') return 'border-l-success'
  if (text === '需修改') return 'border-l-warning'
  if (text === '不通过') return 'border-l-error'
  return 'border-l-default'
}

function conclusionTextClass(section: VerifySection): string {
  const text = getConclusionText(section)
  if (text === '通过') return 'text-success'
  if (text === '需修改') return 'text-warning'
  if (text === '不通过') return 'text-error'
  return 'text-default'
}

const isVerifyPassed = computed(() => {
  const conclusionSection = parsedVerifySections.value.find(s => s.type === 'conclusion')
  if (!conclusionSection) return false
  return getConclusionText(conclusionSection) === '通过'
})

watch(
  () => caseStore.currentType,
  (type) => {
    if (type === 'case') {
      viewMode.value = 'content'
    }
  },
)

function handleVerify() {
  if (viewMode.value === 'verify') {
    viewMode.value = 'content'
  } else if (caseStore.verifyResult) {
    viewMode.value = 'verify'
  } else {
    viewMode.value = 'verify'
    caseStore.verify()
  }
}

function handleReverify() {
  caseStore.verifyResult = null
  caseStore.verifyReasoning = null
  caseStore.verify()
}

function handleAutoFix() {
  viewMode.value = 'content'
  contentMode.value = 'markdown'
  caseStore.fix()
}

function handleEdit() {
  viewMode.value = 'content'
  isEditing.value = true
}
</script>
