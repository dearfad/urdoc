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
    const databaseRouter = useDatabaseRouter()
    const prompts = ref({
      system: {
        case: {
          id: '',
          type: 'case',
          title: '默认',
          prompt: defaultCasePrompt,
        },
        story: {
          id: '',
          type: 'story',
          title: '默认',
          prompt: defaultStoryPrompt,
        },
        test: {
          id: '',
          type: 'test',
          title: '默认',
          prompt: defaultTestPrompt,
        },
        act: {
          id: '',
          type: 'act',
          title: '默认',
          prompt: defaultActPrompt,
        },
        rate: {
          id: '',
          type: 'rate',
          title: '默认',
          prompt: defaultRatePrompt,
        },

        // "相貌": "一位中年女性，60岁，身材肥胖，白色头发，颈部粗大，脸上带着一丝疲惫，痛苦表情。"
        face: {
          id: '',
          type: 'face',
          title: '默认',
          prompt: defaultFacePrompt,
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

    async function getPrompts() {
      try {
        const response = await databaseRouter.prompt('list')
        if (response.status === 'OK') {
          const promptList = ['case', 'story', 'test', 'act', 'rate']
          promptList.forEach((item) => {
            prompts.value.user[item] = response.data.filter((i) => i.type === item)
          })
          stateStore.appInfo = '读取成功'
        } else {
          stateStore.appInfo = '读取失败: ' + response.data
        }
      } catch (error) {
        stateStore.appInfo = '读取错误: ' + error
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

    return { prompts, getSystemPrompt, getPrompts, defaultCasePrompt }
  },
  {
    persist: true,
  }
)
