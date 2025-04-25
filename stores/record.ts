export const useRecordStore = defineStore(
  'record',
  () => {
    const promptStore = usePromptStore()
    const modelRouter = useModelRouter()
    const databaseRouter = useDatabaseRouter()
    const stateStore = useStateStore()

    // Medical Records
    const record = ref<MedicalRecord>({
      id: 0,
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
      story: {
        故事: '',
      },
      test: [
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
      act: [],
      rate: [],
      scope: {
        book: '',
        chapter: '',
        section: '',
        subsection: '',
      },
      tag: {
        case: [],
        story: [],
        test: [],
        act: [],
        rate: [],
      },
      face: '',
      pose: '',
      voice: '',
    })
    const records = ref<MedicalRecords>([])

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

    const storyText = computed(() => {
      return Object.entries(record.value.story)
        .map(([key, value]) => `${key}: ${value}`)
        .join('\n\n')
    })

    const storyMarkdown = computed(() => {
      return Object.entries(record.value.story)
        .map(([key, value]) => `**${key}**:\n\n${value}`)
        .join('\n\n')
    })

    const testText = computed(() => {
      // return record.value.test
      return record.value.test
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

    const testMarkdown = computed(() => {
      // return record.value.test
      return record.value.test
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
        story: {
          json: record.value.story,
          text: storyText.value,
          markdown: storyMarkdown.value,
        },
        test: {
          json: record.value.test,
          text: testText.value,
          markdown: testMarkdown.value,
        },
      }
    })

    // 重置当前数据
    // https://pinia.vuejs.org/zh/core-concepts/state.html
    function $reset() {
      record.value = {
        id: 0,
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
        story: {
          故事: '',
        },
        test: [
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
        act: [],
        rate: [],
        scope: {
          book: '',
          chapter: '',
          section: '',
          subsection: '',
        },
        tag: {
          case: [],
          story: [],
          test: [],
          act: [],
          rate: [],
        },
        face: '',
        voice: '',
        pose: '',
      }
      stateStore.isActing = false
      stateStore.isRating = false
    }

    async function getCase() {
      $reset()
      const messages: Messages = promptStore.getSystemPrompt('case')
      record.value.case = JSON.parse(await modelRouter.getCase(messages))
      record.value.scope = stateStore.scope
      record.value.tag.case = stateStore.tag.case
    }

    async function getStory() {
      const messages: Messages = promptStore.getSystemPrompt('story')
      record.value.story = JSON.parse(await modelRouter.getStory(messages))
      record.value.tag.story = stateStore.tag.story
    }

    async function getTest() {
      const messages: Messages = promptStore.getSystemPrompt('test')
      record.value.test = Object.values(JSON.parse(await modelRouter.getTest(messages)))
      record.value.tag.test = stateStore.tag.test
    }

    async function getAct() {
      if (record.value.act.length === 0) {
        record.value.act = promptStore.getSystemPrompt('act')
      }
      record.value.act.push({ role: 'user', content: stateStore.userPrompt })
      record.value.act.push({
        role: 'assistant' as Role,
        content: await modelRouter.getAct(record.value.act),
      })
    }

    async function getRate() {
      if (record.value.rate.length === 0) {
        record.value.rate = promptStore.getSystemPrompt('rate')
      }
      record.value.rate.push({ role: 'user', content: stateStore.userPrompt })
      record.value.rate.push({
        role: 'assistant' as Role,
        content: await modelRouter.getRate(record.value.rate),
      })
    }

    async function insert() {
      try {
        type Result = { status: string; data: string }
        const result = (await databaseRouter.insertRecord()) as Result
        if (result.status === 'OK') {
          record.value.id = Number(result.data)
          stateStore.appInfo = '保存成功'
        } else {
          stateStore.appInfo = '保存失败: ' + result.data
        }
      } catch (error) {
        stateStore.appInfo = '插入错误: ' + error
      }
    }
    async function update() {
      try {
        type Result = { status: string; data: string }
        const result = (await databaseRouter.updateRecord()) as Result
        if (result.status === 'OK') {
          stateStore.appInfo = '更新完毕'
        } else {
          stateStore.appInfo = '更新失败: ' + result.data
        }
      } catch (error) {
        stateStore.appInfo = '更新错误: ' + error
      }
    }
    async function load() {}
    async function remove() {}

    async function newRecord() {
      $reset()
      await getCase()
      await getStory()
      await getTest()
      //   caseFaceUrl.value = await modelRouter.getFace()
    }

    return {
      record,
      records,
      watchFields,
      view,

      $reset,
      getCase,
      getStory,
      getTest,
      getAct,
      getRate,
      newRecord,

      insert,
      remove,
      load,
      update,
    }
  },
  {
    persist: true,
  }
)
