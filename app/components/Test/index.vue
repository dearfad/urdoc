<template>
  <UCard
    id="component-test-index"
    :ui="{
      root: 'border border-default overflow-auto flex min-h-0 flex-1 flex-col',
      header: 'bg-elevated flex items-center py-2 ',
      body: 'py-0 sm:py-2 flex-1',
      footer: 'p-0 sm:p-0',
    }"
  >
    <template #header>
      <UButton icon="i-mdi-alpha-t-circle" variant="ghost" to="/cstar/test" />
      <span class="font-bold">考核理论</span>
      <div class="ms-auto flex items-center gap-2">
        <ButtonGenerate type="test" task="generate" label="生成考核" />
        <UPopover v-model:open="isMenuOpen" :dismissible="true" class="md:hidden" :ui="{ content: 'bg-default shadow-2xl rounded-xl ring border border-default' }">
          <UButton icon="i-lucide-ellipsis-vertical" variant="ghost" size="sm" />
          <template #content>
            <div class="flex flex-col gap-1 p-1" @click="isMenuOpen = false">
              <UButton
                :icon="settingsVisible ? 'i-lucide-panel-right-close' : 'i-lucide-panel-right-open'"
                variant="ghost"
                @click="$emit('toggleSettings')"
              >
                {{ settingsVisible ? '关闭' : '设定' }}
              </UButton>
              <ButtonCapture capture-id="component-test-index" label="截屏" />
              <ButtonAudio :text="audioText" label="朗读" />
            </div>
          </template>
        </UPopover>
        <div class="hidden md:flex items-center gap-2">
          <UTooltip :text="settingsVisible ? '关闭' : '设定'">
            <UButton
              :icon="settingsVisible ? 'i-lucide-panel-right-close' : 'i-lucide-panel-right-open'"
              variant="ghost"
              :color="settingsVisible ? 'neutral' : 'default'"
              @click="$emit('toggleSettings')"
            />
          </UTooltip>
          <ButtonCapture capture-id="component-test-index" />
          <ButtonAudio :text="audioText" />
        </div>
      </div>
    </template>

    <template #default>
      <ClientOnly>
        <UChatReasoning
          v-if="stateStore.test.isReasoning"
          :text="testStore.test.reasoning"
          defaultOpen
          :ui="{ body: 'max-h-none pt-2' }"
          class="pt-2"
        >
          <Markdown :value="testStore.test.reasoning" class="*:first:mt-0 *:last:mb-0" />
        </UChatReasoning>

        <div v-if="questions.length > 0" class="flex flex-col gap-4 p-2">
          <div v-for="q in questions" :key="q.key" class="border-default bg-elevated rounded-xl border p-4">
            <p class="mb-4 font-semibold">{{ q.key }}：{{ q.question }}</p>
            <div class="flex flex-col gap-2">
              <UButton
                v-for="(opt, label) in q.options"
                :key="label"
                :color="getOptionColor(q, label)"
                :variant="getOptionVariant(q, label)"
                :disabled="testStore.test.submitted"
                size="lg"
                class="justify-start"
                @click="selectAnswer(q.key, label)"
              >
                <div class="flex w-full items-center justify-between gap-2">
                  <span>{{ label }}. {{ opt }}</span>
                  <span
                    v-if="testStore.test.submitted && label === q.correctAnswer"
                    class="shrink-0 text-sm text-[var(--ui-success)]"
                  >
                    正确答案
                  </span>
                  <span
                    v-else-if="
                      testStore.test.submitted &&
                      testStore.test.userAnswers?.[q.key] === label &&
                      label !== q.correctAnswer
                    "
                    class="shrink-0 text-sm text-[var(--ui-error)]"
                  >
                    你的答案
                  </span>
                </div>
              </UButton>
            </div>
          </div>

          <div v-if="!testStore.test.submitted" class="flex justify-center py-2">
            <UButton
              size="xl"
              color="primary"
              variant="solid"
              :disabled="isSubmittingDisabled"
              @click="testStore.submitTest()"
            >
              提交答案
            </UButton>
          </div>

          <div v-else class="border-default bg-elevated flex flex-col items-center gap-3 rounded-xl border p-6">
            <div :class="scoreClass" class="text-5xl font-bold">{{ testStore.test.score }}%</div>
            <div class="text-[var(--ui-text-muted)]">{{ correctCount }} / {{ totalCount }} 题正确</div>
            <UButton variant="soft" color="neutral" @click="testStore.resetTest()"> 重新答题 </UButton>
          </div>
        </div>

        <div
          v-if="!questions.length && !stateStore.test.isReasoning"
          class="flex flex-1 items-center justify-center text-[var(--ui-text-muted)]"
        >
          点击「生成考核」开始答题
        </div>
      </ClientOnly>
    </template>

    <template #footer>
      <div v-if="testStore.test.custom && testStore.test.custom.length > 0" class="mx-4 my-2 flex flex-wrap gap-2">
        <UBadge
          v-for="custom in testStore.test.custom"
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

<script setup>
import { parse } from 'partial-json'
defineProps({
  settingsVisible: { type: Boolean, default: true },
})
defineEmits(['toggleSettings'])
const isMenuOpen = ref(false)
const testStore = useTestStore()
const stateStore = useStateStore()

const questions = computed(() => {
  if (!testStore.test?.content) return []
  const raw = typeof testStore.test.content === 'string' ? parse(testStore.test.content) : testStore.test.content
  if (!raw || typeof raw !== 'object') return []
  return Object.entries(raw)
    .filter(([_, v]) => v && v.问题 && v.选项 && v.答案)
    .map(([key, value]) => ({
      key,
      question: value.问题,
      options: value.选项,
      correctAnswer: value.答案,
    }))
})

const correctCount = computed(() => {
  if (!testStore.test.userAnswers) return 0
  return questions.value.filter((q) => testStore.test.userAnswers[q.key] === q.correctAnswer).length
})

const totalCount = computed(() => questions.value.length)

const isSubmittingDisabled = computed(() => {
  if (testStore.status !== 'ready') return true
  const answers = testStore.test.userAnswers
  if (!answers) return true
  return questions.value.some((q) => !answers[q.key])
})

const scoreClass = computed(() => {
  const score = testStore.test.score ?? 0
  if (score >= 80) return 'text-[var(--ui-success)]'
  if (score >= 60) return 'text-[var(--ui-warning)]'
  return 'text-[var(--ui-error)]'
})

const audioText = computed(() => {
  if (!questions.value.length) return ''
  return questions.value
    .map((q) => {
      const opts = Object.entries(q.options)
        .map(([k, v]) => `${k}. ${v}`)
        .join('、')
      return `${q.key}：${q.question}，选项：${opts}。`
    })
    .join('')
})

function selectAnswer(key, label) {
  if (testStore.test.submitted) return
  testStore.setUserAnswer(key, label)
}

function getOptionColor(q, label) {
  const { submitted, userAnswers } = testStore.test
  if (!submitted) {
    return userAnswers?.[q.key] === label ? 'primary' : 'neutral'
  }
  if (label === q.correctAnswer) return 'success'
  if (userAnswers?.[q.key] === label && label !== q.correctAnswer) return 'error'
  return 'neutral'
}

function getOptionVariant(q, label) {
  const { submitted, userAnswers } = testStore.test
  if (!submitted) {
    return userAnswers?.[q.key] === label ? 'solid' : 'soft'
  }
  if (label === q.correctAnswer || userAnswers?.[q.key] === label) return 'solid'
  return 'ghost'
}
</script>
