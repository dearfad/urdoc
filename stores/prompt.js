import defaultCasePrompt from '@/assets/default/case/prompt.md?raw'
import defaultStoryPrompt from '@/assets/default/story/prompt.md?raw'
import defaultTestPrompt from '@/assets/default/test/prompt.md?raw'
import defaultActPrompt from '@/assets/default/act/prompt.md?raw'
import defaultRatePrompt from '@/assets/default/rate/prompt.md?raw'
import defaultFacePrompt from '@/assets/default/face/prompt.md?raw'
export const usePromptStore = defineStore(
  'prompt',
  () => {
    const stateStore = useStateStore()
    const recordStore = useRecordStore()
    const databaseApi = useDatabaseApi()
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
      },
      user: {
        case: [],
        story: [],
        test: [],
        act: [],
        rate: [],
        face: [],
      },
    })

    async function managePrompt(action, prompt) {
      let response
      try {
        switch (action) {
          case 'list':
            {
              response = await databaseApi.operatePrompt('list')

              if (response.status === 'OK') {
                const promptList = ['case', 'story', 'test', 'act', 'rate']
                promptList.forEach((item) => {
                  prompts.value.user[item] = response.data.filter((i) => i.type === item)
                })
              }
            }
            break
          case 'load':
            response = await databaseApi.operatePrompt('fetch', prompt)
            break
          case 'insert':
            response = await databaseApi.operatePrompt('insert', prompt)
            break
          case 'update':
            response = await databaseApi.operatePrompt('update', prompt)
            break
          case 'delete':
            response = await databaseApi.operatePrompt('delete', prompt)
            break
        }
        return response.data
      } catch (error) {
        stateStore.appInfos.push('错误: ' + error.message)
      } finally {
        if (response.status != 'OK') {
          stateStore.appInfos.push('失败: ' + response.data)
        }
      }
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

    return { prompts, getSystemPrompt, managePrompt, defaultCasePrompt }
  },
  {
    persist: true,
  }
)
