export const useCaseStore = defineStore(
  'case',
  () => {
    const promptStore = usePromptStore()
    const modelRouter = useModelRouter()
    const stateStore = useStateStore()
    // CSTAR MODEL BASIC FIELDS
    const record = ref<MedicalRecord>({
      case:{
        姓名: '',
        性别: '',
        年龄: '',
        主诉: '',
        诊断: '',
      },
      story: '',
      test: '',
      act: '',
      rate: '',
      face: '',
      pose: '',
    })
    const caseStory = ref('')
    const caseTest = ref('')
    const caseAct = ref([])
    const caseRate = ref('')
    const caseFaceUrl = ref('')
    const casePose = ref('')
    const casePoseId = ref('')


    // Messages
    const actMessages = ref([])
    const rateMessages = ref([])
    // 自定义设定
    const caseTag = ref('')
    const storyTag = ref('真实')
    const testTag = ref('执业医师考试')

    // Watch Generating Fields
    const caseContentFields = ref([
      '姓名',
      '性别',
      '年龄',
      '主诉',
      '现病史',
      '既往史',
      '查体',
      '专科查体',
      '辅助检查',
      '诊断',
      '治疗',
      '手术',
      '病理',
    ])
    const caseStoryFields = ref(['相貌', '故事'])
    const caseTestFields = ref(['题目1', '题目2', '题目3'])

    // Computed Fields

    // 题目文本格式，考试模式
    const caseContentText = computed(() => {
      let text = `患者，${record.value.case.性别}，${record.value.case.年龄}，因${record.value.case.主诉}入院。${record.value.case.现病史}${record.value.case.既往史}查体：${record.value.case.查体}专科查体：${record.value.case.专科查体}辅助检查：${record.value.case.辅助检查}`
        if (record.value.case.诊断) {
          text += `诊断：${record.value.case.诊断}`
        }
        if (record.value.case.治疗) {
          text += `治疗：${record.value.case.治疗}`
        }
        if (record.value.case.手术) {
          text += `手术：${record.value.case.手术}`
        }
        if (record.value.case.病理) {
          text += `病理：${record.value.case.病理}`
        }
        return text
    })

    // 题目Markdown格式，显示模式
    const caseContentMarkdown = computed(() => {
      return Object.entries(record.value.case)
        .map(([key, value]) => `**${key}：** ${value}`)
        .join('\n\n')
    })
    const caseStoryMarkdown = computed(() => {
      return Object.entries(caseStory.value)
        .map(([key, value]) => `**${key}：** ${value}`)
        .join('\n\n')
    })
    const caseTestMarkdown = computed(() => {
      // return Object.entries(caseTest.value)
      //     .map(([key, value]) => `**${key}：** ${value}`)
      //     .join('\n\n')
      let markdown = ''
      for (const [key, value] of Object.entries(caseTest.value)) {
        markdown += `**问题${key.slice(2)}**: ${value['问题']}\n`
        markdown += '\n'
        markdown += `**选项**:\n`
        for (const [optionKey, optionValue] of Object.entries(value['选项'])) {
          markdown += `${optionKey}: ${optionValue}\n`
        }
        markdown += `\n**答案**: ${value['答案']}\n`
        markdown += '\n'
      }
      return markdown
    })

    // 重置所有数据，例如生成新病例前
    // https://pinia.vuejs.org/zh/core-concepts/state.html
    function $reset() {
      const record = ref<MedicalRecord>({
        case:{
          姓名: '',
          性别: '',
          年龄: '',
          主诉: '',
          诊断: '',
        },
        story: '',
        test: '',
        act: '',
        rate: '',
        face: '',
        pose: '',
      })
      stateStore.isActing = false
      stateStore.isRating = false
      actMessages.value = []
      rateMessages.value = []
    }

    async function newCase() {
      $reset()
      let messages = ''
      messages = [
        { role: 'system', content: promptStore.casePrompt },
        {
          role: 'user',
          content:
            '病例要点设定：\n' +
            stateStore.selectedBook +
            '\n' +
            stateStore.selectedChapter +
            '\n' +
            stateStore.selectedSection +
            '\n' +
            stateStore.selectedSubsection +
            '\n' +
            caseTag.value,
        },
      ]
      case.value = JSON.parse(await modelRouter.getCase(messages))
      caseFaceUrl.value = await modelRouter.getFace()
      messages = [
        { role: 'system', content: promptStore.storyPrompt },
        {
          role: 'user',
          content: caseContentMarkdown.value + storyTag.value,
        },
      ]
      caseStory.value = JSON.parse(await modelRouter.getStory(messages))
      messages = [
        { role: 'system', content: promptStore.testPrompt },
        {
          role: 'user',
          content: caseContentMarkdown.value + testTag.value,
        },
      ]
      caseTest.value = JSON.parse(await modelRouter.getTest(messages))
    }

    return {
      record,
      // caseContent: case,
      // caseStory,
      // caseTest,
      // caseAct,
      // caseRate,
      // caseFaceUrl,
      // casePose,
      // casePoseId,

      actMessages,
      rateMessages,

      caseTag,
      storyTag,
      testTag,

      caseContentFields,
      caseStoryFields,
      caseTestFields,
      caseContentText,
      caseContentMarkdown,
      caseStoryMarkdown,
      caseTestMarkdown,

      $reset,
      newCase,
    }
  },
  {
    persist: true,
  }
)
