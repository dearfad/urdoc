import defaultCasePrompt from '@/assets/default/case/prompt.md?raw'
import defaultCheckPrompt from '@/assets/default/case/check.md?raw'
import defaultStoryPrompt from '@/assets/default/story/prompt.md?raw'
import defaultTestPrompt from '@/assets/default/test/prompt.md?raw'
import defaultActPrompt from '@/assets/default/act/prompt.md?raw'
import defaultRatePrompt from '@/assets/default/rate/prompt.md?raw'
import defaultFacePrompt from '@/assets/default/face/prompt.md?raw'
import defaultPosePrompt from '@/assets/default/pose/prompt.md?raw'
export const usePromptStore = defineStore(
  'prompt',
  () => {
    const stateStore = useStateStore()
    const recordStore = useRecordStore()
    const userStore = useUserStore()
    const promptApi = usePromptApi()
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
        check: {
          id: '',
          type: 'check',
          title: '默认',
          prompt: defaultCheckPrompt,
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
      },
      user: {
        case: [],
        story: [],
        test: [],
        act: [],
        rate: [],
        face: [],
        pose: [],
      },
      image: {
        face: '',
      },
      video: {
        pose: '',
      },
    })

    const prompt = {
      async selectAll() {
        try {
          const response = await promptApi.database('selectAll', '', userStore.user)
          if (response.error) {
            stateStore.appInfos.push('提示词列表错误', response.error.code)
          } else {
            const promptList = ['case', 'story', 'test', 'act', 'rate', 'face', 'pose']
            promptList.forEach((item) => {
              prompts.value.user[item] = response.data.filter((i) => i.type === item)
            })
          }
        } catch (error) {
          stateStore.appInfos.push('提示词列表异常: ' + error)
        }
      },

      async select(promptData) {
        try {
          const response = await promptApi.database('select', promptData)
          if (response.error) {
            stateStore.appInfos.push('提示词获取错误', response.error.code)
          } else {
            return response.data[0]
          }
        } catch (error) {
          stateStore.appInfos.push('提示词获取异常: ' + error)
        }
      },
      async insert(promptData) {
        try {
          const response = await promptApi.database('insert', promptData)
          if (response.error) {
            stateStore.appInfos.push('提示词填加错误', response.error.message)
          } else {
            return response.data[0]
          }
        } catch (error) {
          stateStore.appInfos.push('提示词填加异常: ' + error)
        }
      },

      async update(promptData) {
        try {
          const response = await promptApi.database('update', promptData)
          if (response.error) {
            stateStore.appInfos.push('提示词更新错误', response.error.code)
          } else {
            return response.data[0]
          }
        } catch (error) {
          stateStore.appInfos.push('提示词更新异常: ' + error)
        }
      },

      async delete(promptData) {
        try {
          const response = await promptApi.database('delete', promptData)
          if (response.error) {
            stateStore.appInfos.push('提示词删除错误', response.error.code)
          } else {
            return response.data[0]
          }
        } catch (error) {
          stateStore.appInfos.push('提示词删除异常: ' + error)
        }
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
        case 'check':
          content = `提供病例如下：${recordStore.view.case.markdown}`
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

    return { prompts, prompt, getSystemPrompt }
  },
  {
    persist: true,
  }
)
