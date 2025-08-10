import defaultCasePrompt from '@/assets/default/case/prompt.md?raw'
import defaultStoryPrompt from '@/assets/default/story/prompt.md?raw'
import defaultTestPrompt from '@/assets/default/test/prompt.md?raw'
import defaultActPrompt from '@/assets/default/act/prompt.md?raw'
import defaultRatePrompt from '@/assets/default/rate/prompt.md?raw'
import defaultFacePrompt from '@/assets/default/face/prompt.md?raw'
import defaultPosePrompt from '@/assets/default/pose/prompt.md?raw'
import defaultReviewPrompt from '@/assets/default/review/prompt.md?raw'
import defaultVerifyPrompt from '@/assets/default/verify/prompt.md?raw'

export const usePromptStore = defineStore(
  'prompt',
  () => {
    const stateStore = useStateStore()
    const recordStore = useRecordStore()
    const supabase = useSupabase()
    const promptType = ['case', 'story', 'test', 'act', 'rate', 'face', 'pose', 'review', 'verify']
    const prompts = ref({
      system: {
        case: {
          id: '',
          type: 'case',
          title: '默认',
          prompt: defaultCasePrompt,
          author: '',
          public: true,
        },
        story: {
          id: '',
          type: 'story',
          title: '默认',
          prompt: defaultStoryPrompt,
          author: '',
          public: true,
        },
        test: {
          id: '',
          type: 'test',
          title: '默认',
          prompt: defaultTestPrompt,
          author: '',
          public: true,
        },
        act: {
          id: '',
          type: 'act',
          title: '默认',
          prompt: defaultActPrompt,
          author: '',
          public: true,
        },
        rate: {
          id: '',
          type: 'rate',
          title: '默认',
          prompt: defaultRatePrompt,
          author: '',
          public: true,
        },
        face: {
          id: '',
          type: 'face',
          title: '默认',
          prompt: defaultFacePrompt,
          author: '',
          public: true,
        },
        pose: {
          id: '',
          type: 'face',
          title: '默认',
          prompt: defaultPosePrompt,
          author: '',
          public: true,
        },
        review: {
          id: '',
          type: 'check',
          title: '默认',
          prompt: defaultReviewPrompt,
          author: '',
          public: true,
        },
        verify: {
          id: '',
          type: 'check',
          title: '默认',
          prompt: defaultVerifyPrompt,
          author: '',
          public: true,
        },
      },
      user: {
        case: [],
        story: [],
        test: [],
        act: [],
        rate: [],
        face: [],
        pose: [],
        review: [],
        verify: [],
      },
      image: {
        face: '',
      },
      video: {
        pose: '',
      },
    })

    const database = {
      async selectAll() {
        const { data, error } = await supabase.getData('prompts').selectAll()
        !error &&
          promptType.forEach((item) => {
            prompts.value.user[item] = data.filter((i) => i.type === item)
          })
        // stateStore.appInfos.push(!error ? '刷新成功' : '刷新失败')
      },
      async selectByColumn(column, value) {
        const { data, error } = await supabase.getData('prompts').selectByColumn(column, value)
        !error && (prompts.value.user[value] = data)
        // stateStore.appInfos.push(!error ? '刷新成功' : '刷新失败')
      },

      async select(promptData) {
        const { data, error } = await supabase.getData('prompts').select(promptData)
        return error ? undefined : data[0]
      },

      async insert(promptData) {
        const { data, error } = await supabase.getData('prompts').insert(promptData)
        stateStore.appInfos.push(!error && data.length > 0 ? '添加成功' : '添加失败')
        return error ? undefined : data[0]
      },

      async update(promptData) {
        const { data, error } = await supabase.getData('prompts').update(promptData)
        stateStore.appInfos.push(!error && data.length > 0 ? '更新成功' : '更新失败')
        return error ? undefined : data[0]
      },

      async remove(promptData) {
        const { data, error } = await supabase.getData('prompts').remove(promptData)
        stateStore.appInfos.push(!error && data.length > 0 ? '删除成功' : '删除失败')
        return error ? undefined : data[0]
      },
    }

    function getSystemPrompt(systemPromptType) {
      let content = ''
      switch (systemPromptType) {
        case 'case':
          content = `系统要点设定：${stateStore.tag.case?.join(' ')} ${Object.values(
            stateStore.scope
          ).join(' ')}\n`
          break

        case 'story':
          content = `系统要点设定：${stateStore.tag.story?.join(' ')} ${
            recordStore.view.case.markdown
          }`
          break
        case 'test':
          content = `系统要点设定：${stateStore.tag.test?.join(' ')} ${
            recordStore.view.case.markdown
          } ${recordStore.view.story.markdown}`
          break
        case 'act':
          content = `下面是用户提供的病历：\n${recordStore.view.case.markdown}`
          break
        case 'rate':
          content = `下面是用户提供的题库：\n${recordStore.view.test.markdown}`
          break
        case 'face':
          content = `下面是用户提供的病历：\n${recordStore.view.case.markdown}`
          break
        case 'pose':
          content = `下面是用户提供的病历：\n${recordStore.view.case.markdown}`
          break
        case 'review':
          content = `提供病例如下：${recordStore.view.case.markdown}`
          break
        case 'verify':
          content = `提供问题如下：${recordStore.view.case.markdown}`
          break
        default:
          content = '系统要点设定：无特殊要求'
          break
      }
      return [
        { role: 'system', content: prompts.value.system[systemPromptType].prompt },
        {
          role: 'user',
          content: content,
        },
      ]
    }

    return { prompts, database, getSystemPrompt }
  },
  {
    persist: true,
  }
)
