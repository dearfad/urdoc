export const useRecordStore = defineStore(
  'record',
  () => {
    const promptStore = usePromptStore()
    const modelRouter = useModelRouter()
    const stateStore = useStateStore()

    // Medical Records
    const record = ref<MedicalRecord>({
      case: {
        姓名: '',
        性别: '',
        年龄: '',
        主诉: '',
        现病史: '',
        既往史: '',
        查体: '',
        专科查体: '',
        辅助检查: '',
        诊断: '',
        治疗: '',
        手术: '',
        病理: '',
      },
      story: '',
      tests: [
        {
          问题: '',
          选项: {
            A: '',
            B: '',
            C: '',
            D: '',
          },
          答案: '',
        },
      ],
      act: '',
      rate: '',
      face: '',
      voice: '',
      pose: '',
    })
    const records = ref<MedicalRecords>([])

    // Messages
    const messages = ref({
      act: [] as Messages,
      rate: [] as Messages,
    })

    // 观察字段，提示进度
    const watchFields = ref<Fields>({
      case: Object.keys(record.value.case),
    })

    // 题目文本格式，考试模式
    const caseText = computed(() => {
      const data = record.value.case
      const fields = [
        `患者，${data.性别}, ${data.年龄}，因${data.主诉}入院。`,
        data.现病史,
        data.既往史,
        `查体：${data.查体}`,
        `专科查体：${data.专科查体}`,
        `辅助检查：${data.辅助检查}`,
        data.诊断 ? `诊断：${data.诊断}` : null,
        data.治疗 ? `治疗：${data.治疗}` : null,
        data.手术 ? `手术：${data.手术}` : null,
        data.病理 ? `病理：${data.病理}` : null,
      ]
      return fields.filter(Boolean).join(' ')
    })

    // 题目Markdown格式，默认显示模式
    const caseMarkdown = computed(() => {
      return Object.entries(record.value.case)
        .map(([key, value]) => `**${key}**: ${value}`)
        .join('\n\n')
    })

    const testsText = computed(() => {
      return record.value.tests
        .map((test, index) => {
          const question = `问题${index + 1}: ${test.问题}`
          const options = Object.entries(test.选项)
            .map(([optionKey, optionValue]) => `${optionKey}: ${optionValue}`)
            .join(' ')
          const answer = `答案: ${test.答案}`
          return `${question}\n${options}\n${answer}`
        })
        .join('\n\n')
    })

    const testsMarkdown = computed(() => {
      return record.value.tests
        .map((test, index) => {
          const question = `**问题${index + 1}**: ${test.问题}\n`
          const options = Object.entries(test.选项)
            .map(([optionKey, optionValue]) => `${optionKey}: ${optionValue}`)
            .join('\n')
          const answer = `**答案**: ${test.答案}\n`
          return `${question}\n**选项**:\n${options}\n\n${answer}\n`
        })
        .join('\n\n')
    })

    const view = computed(() => {
      return {
        case: {
          json: record.value.case,
          text: caseText.value,
          markdown: caseMarkdown.value,
        },
        tests: {
          json: record.value.tests,
          text: testsText.value,
          markdown: testsMarkdown.value,
        },
      }
    })

    // 重置当前数据
    // https://pinia.vuejs.org/zh/core-concepts/state.html
    function $reset() {
      record.value = {
        case: {
          姓名: '',
          性别: '',
          年龄: '',
          主诉: '',
          现病史: '',
          既往史: '',
          查体: '',
          专科查体: '',
          辅助检查: '',
          诊断: '',
          治疗: '',
          手术: '',
          病理: '',
        },
        story: '',
        tests: [
          {
            问题: '',
            选项: {
              A: '',
              B: '',
              C: '',
              D: '',
            },
            答案: '',
          },
        ],
        act: '',
        rate: '',
        face: '',
        voice: '',
        pose: '',
      }
      messages.value = {
        act: [],
        rate: [],
      }
      stateStore.isActing = false
      stateStore.isRating = false
    }

    async function getCase() {
      const messages: Messages = [
        { role: 'system', content: promptStore.casePrompt },
        {
          role: 'user',
          content: `病例要点设定：${Object.values(stateStore.bookScope).join('\n')}\n${
            stateStore.customConfig.case
          }`,
        },
      ]
      record.value.case = JSON.parse(await modelRouter.getCase(messages))
    }

    async function newRecord() {
      $reset()
      await getCase()
      //   caseFaceUrl.value = await modelRouter.getFace()
      //   messages = [
      //     { role: 'system', content: promptStore.storyPrompt },
      //     {
      //       role: 'user',
      //       content: caseContentMarkdown.value + storyTag.value,
      //     },
      //   ]
      //   caseStory.value = JSON.parse(await modelRouter.getStory(messages))
      //   messages = [
      //     { role: 'system', content: promptStore.testPrompt },
      //     {
      //       role: 'user',
      //       content: caseContentMarkdown.value + testTag.value,
      //     },
      //   ]
      //   caseTest.value = JSON.parse(await modelRouter.getTest(messages))
    }

    return {
      record,
      records,
      messages,
      watchFields,
      view,

      $reset,
      getCase,
      newRecord,
    }
  },
  {
    persist: true,
  }
)
