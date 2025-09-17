export const useRecordStore = defineStore(
  'record',
  () => {
    const promptStore = usePromptStore()
    const modelRouter = useModelRouter()
    const supabase = useSupabase()
    const stateStore = useStateStore()
    const modelStore = useModelStore()

    // Medical Records
    const record = ref({
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
        插图: [],
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
        part: '',
        chapter: '',
        section: '',
        subsection: '',
        topic: '',
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
      author: '',
      public: true,
    })
    const records = ref([])

    // 观察字段，提示进度
    const watchFields = ref({
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
      // return Object.entries(record.value.story)
      //   .map(([key, value]) => `**${key}**:\n\n${value}`)
      //   .join('\n\n')
      return record.value.story['故事']
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
          插图: [],
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
          part: '',
          chapter: '',
          section: '',
          subsection: '',
          topic: '',
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
        author: '',
        public: true,
      }
      stateStore.isActing = false
      stateStore.isRating = false
      promptStore.prompts.image.face = ''
      promptStore.prompts.video.pose = ''
    }

    async function getCase() {
      $reset()
      const messages = promptStore.getSystemPrompt('case')
      await modelRouter.getCase(messages)
      if (!modelStore.modelResponse.content) return
      try {
        const caseJson = modelStore.modelResponse.content
        record.value.case = caseJson
        record.value.scope = stateStore.scope
        record.value.tag.case = stateStore.tag.case
      } catch (error) {
        stateStore.appInfos.push('获取病例失败: ' + error)
      }
    }

    async function checkCase() {
      const messages = promptStore.getSystemPrompt('review')
      const result = JSON.parse(await modelRouter.checkCase(messages))
      // 计划中
      stateStore.appInfos.push(result)
    }

    async function getStory() {
      const messages = promptStore.getSystemPrompt('story')
      await modelRouter.getStory(messages)
      record.value.story.故事 = modelStore.modelResponse.content
      record.value.tag.story = stateStore.tag.story
    }

    async function getStoryIllustration() {
      record.value.story.插图 = []
      const messages = promptStore.getSystemPrompt('illustration')
      await modelRouter.getStoryIllustration(messages)
    }

    async function getTest() {
      const messages = promptStore.getSystemPrompt('test')
      record.value.test = Object.values(JSON.parse(await modelRouter.getTest(messages)))
      record.value.tag.test = stateStore.tag.test
    }

    async function getAct() {
      if (record.value.act.length === 0) {
        record.value.act = promptStore.getSystemPrompt('act')
      }
      record.value.act.push({ role: 'user', content: stateStore.userPrompt })
      stateStore.responseText = await modelRouter.getAct(record.value.act)
      record.value.act.push({
        role: 'assistant',
        content: stateStore.responseText,
      })
    }

    async function getRate() {
      if (record.value.rate.length === 0) {
        record.value.rate = promptStore.getSystemPrompt('rate')
      }
      record.value.rate.push({ role: 'user', content: stateStore.userPrompt })
      stateStore.responseText = await modelRouter.getRate(record.value.rate)
      record.value.rate.push({
        role: 'assistant',
        content: stateStore.responseText,
      })
    }

    async function getFace() {
      promptStore.prompts.image.face = ''
      const messages = promptStore.getSystemPrompt('face')
      record.value.face = await modelRouter.getFace(messages)
    }

    async function getPose() {
      promptStore.prompts.image.pose = ''
      const messages = promptStore.getSystemPrompt('pose')
      record.value.pose = await modelRouter.getPose(messages)
    }

    async function getVoice(text) {
      record.value.voice = ''
      record.value.voice = await modelRouter.getVoice(text)
    }

    const database = {
      async selectAll() {
        const { data, error } = await supabase.getData('records').selectAll()
        error ? stateStore.appInfos.push('病例列表错误') : (stateStore.listRecords = data)
      },

      async insert(recordData) {
        const { data, error } = await supabase.getData('records').insert(recordData)
        if (error) {
          stateStore.appInfos.push(!error && data.length > 0 ? '添加成功' : '添加失败')
        } else {
          record.value.id = data[0].id
          record.value.author = data[0].author
        }
      },

      async update(recordData) {
        const { data, error } = await supabase.getData('records').update(recordData)
        stateStore.appInfos.push(!error && data.length > 0 ? '更新成功' : '更新失败')
        return error ? undefined : data[0]
      },

      async select(recordData) {
        const { data, error } = await supabase.getData('records').select(recordData)
        if (error) {
          stateStore.appInfos.push('记录读取错误')
        } else {
          $reset()
          record.value.id = data[0].id
          for (const key in record.value.case) {
            record.value.case[key] = data[0].record.case[key] || ''
          }
          record.value.story = data[0].record.story
          record.value.test = data[0].record.test
          record.value.scope = data[0].record.scope
          record.value.tag = data[0].record.tag
          record.value.author = data[0].record.author
          record.value.public = data[0].record.public
        }
      },

      async delete(recordData) {
        const { error } = await supabase.getData('records').delete(recordData)
        if (error) {
          stateStore.appInfos.push('记录删除错误')
        } else {
          await database.selectAll()
        }
      },
    }

    async function newRecord() {
      $reset()
      await getCase()
      await getStory()
      await getTest()
      await getFace()
    }

    async function saveAvatar() {
      if (record.value.face) {
        console.log('开始上传头像')
        const link = await $fetch('/utils/oss', {
          baseURL: stateStore.apiBaseUrl,
          method: 'POST',
          body: JSON.stringify({
            params: { url: record.value.face },
          }),
        })
        console.log('像上头传成功: ' + JSON.stringify(link))
      }
    }
    // /api/utils/oss

    // import OSS from 'ali-oss'
    // export default defineEventHandler(async (event) => {
    //   const { params } = await readBody(event)

    //   const client = new OSS({
    //     region: 'oss-cn-beijing',
    //     accessKeyId: process.env.OSS_ALIYUN_ACCESS_KEY_ID,
    //     accessKeySecret: process.env.OSS_ALIYUN_ACCESS_KEY_SECRET,
    //     bucket: 'urdoc-avatar',
    //   })

    //   const blob = await $fetch(params.url, {
    //     method: 'GET',
    //     responseType: 'blob', // 👈 关键
    //   })
    //   const buffer = await blob.arrayBuffer()
    //   const result = await client.put(params.url.split('/').pop(), Buffer.from(buffer))
    //   return result
    // })

    return {
      record,
      records,
      watchFields,
      view,

      $reset,
      getCase,
      checkCase,
      getStory,
      getStoryIllustration,
      getTest,
      getAct,
      getRate,
      getFace,
      getPose,
      getVoice,
      newRecord,

      database,

      saveAvatar,
    }
  },
  {
    persist: true,
  }
)
