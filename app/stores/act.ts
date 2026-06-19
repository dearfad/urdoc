const VERSION = '2026-05-07'

function createAct(): Act {
  return {
    id: 0,
    caseId: null,
    custom: [],
    reasoning: null,
    content: [],
    quiz: null,
    userAnswers: null,
    quizSubmitted: false,
    quizScore: null,
  }
}

export const useActStore = defineStore('act', () => {
  const version = ref(VERSION)
  syncStoreVersion(VERSION, 'pinia:act')

  const act = ref<Act>(createAct())

  function reset() {
    act.value = createAct()
  }

  function setUserAnswer(key: string, answer: string) {
    if (act.value.quizSubmitted) return
    if (!act.value.userAnswers) {
      act.value.userAnswers = {}
    }
    act.value.userAnswers[key] = answer
  }

  function submitQuiz() {
    if (!act.value.quiz || !act.value.userAnswers) return
    let correct = 0
    const total = act.value.quiz.length
    for (const q of act.value.quiz) {
      const userAns = act.value.userAnswers[q.question]
      if (userAns && userAns === q.answer) {
        correct++
      }
    }
    act.value.quizScore = total > 0 ? Math.round((correct / total) * 100) : 0
    act.value.quizSubmitted = true
  }

  return { version, act, reset, setUserAnswer, submitQuiz }
})
