<template>
  <div class="flex flex-col gap-2 p-2">
    <div
      v-for="(q, idx) in actStore.act.quiz"
      :key="idx"
      class="border-default bg-elevated rounded-xl border p-4"
    >
      <p class="mb-4 font-semibold">{{ idx + 1 }}. {{ q.question }}</p>
      <div class="flex flex-col gap-2">
        <UButton
          v-for="(opt, label) in q.options"
          :key="label"
          :color="optionColor(q, label)"
          :variant="optionVariant(q, label)"
          :disabled="phase === 'submitted'"
          size="lg"
          class="justify-start"
          @click="actStore.setUserAnswer(q.question, label)"
        >
          <div class="flex w-full items-center justify-between gap-2">
            <span>{{ label }}. {{ opt }}</span>
            <span
              v-if="phase === 'submitted' && label === q.answer"
              class="shrink-0 text-sm text-[var(--ui-success)]"
            >
              正确答案
            </span>
            <span
              v-else-if="
                phase === 'submitted' &&
                actStore.act.userAnswers?.[q.question] === label &&
                label !== q.answer
              "
              class="shrink-0 text-sm text-[var(--ui-error)]"
            >
              你的答案
            </span>
          </div>
        </UButton>
      </div>
    </div>
    <div v-if="phase === 'answering'" class="flex justify-center">
      <UButton
        size="xl"
        color="primary"
        variant="solid"
        :disabled="!canSubmitQuiz"
        @click="$emit('submit')"
      >
        提交答案
      </UButton>
    </div>
    <div
      v-if="phase === 'submitted'"
      class="border-default bg-elevated flex flex-col items-center gap-3 rounded-xl border p-6"
    >
      <div :class="scoreClass" class="text-5xl font-bold">{{ actStore.act.quizScore }}%</div>
      <div class="text-[var(--ui-text-muted)]">{{ correctCount }} / {{ totalCount }} 题正确</div>
    </div>
    <div class="flex justify-center gap-4 pt-2">
      <UButton
        size="sm"
        color="neutral"
        variant="soft"
        icon="i-lucide-refresh-ccw"
        :loading="quizLoading"
        :disabled="quizLoading"
        @click="$emit('regenerate')"
      >
        再次出题
      </UButton>
      <UButton
        size="sm"
        color="error"
        variant="soft"
        icon="i-lucide-refresh-ccw"
        @click="$emit('reset')"
      >
        重新问诊
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  phase: {
    type: String,
    required: true,
  },
  quizLoading: {
    type: Boolean,
    required: true,
  },
})

defineEmits(['submit', 'regenerate', 'reset'])

const actStore = useActStore()

const canSubmitQuiz = computed(() => {
  if (props.phase !== 'answering') return false
  if (!actStore.act.quiz || !actStore.act.userAnswers) return false
  return actStore.act.quiz.every((q) => actStore.act.userAnswers[q.question])
})

const correctCount = computed(() => {
  if (!actStore.act.userAnswers || !actStore.act.quiz) return 0
  return actStore.act.quiz.filter((q) => actStore.act.userAnswers[q.question] === q.answer).length
})

const totalCount = computed(() => actStore.act.quiz?.length ?? 0)

const scoreClass = computed(() => {
  const score = actStore.act.quizScore ?? 0
  if (score >= 80) return 'text-[var(--ui-success)]'
  if (score >= 60) return 'text-[var(--ui-warning)]'
  return 'text-[var(--ui-error)]'
})

function optionColor(q, label) {
  if (props.phase !== 'submitted') {
    return actStore.act.userAnswers?.[q.question] === label ? 'primary' : 'neutral'
  }
  if (label === q.answer) return 'success'
  if (actStore.act.userAnswers?.[q.question] === label && label !== q.answer) return 'error'
  return 'neutral'
}

function optionVariant(q, label) {
  if (props.phase !== 'submitted') {
    return actStore.act.userAnswers?.[q.question] === label ? 'solid' : 'soft'
  }
  if (label === q.answer || actStore.act.userAnswers?.[q.question] === label) return 'solid'
  return 'ghost'
}
</script>
