export default function () {
  async function getResponse() {
    const stateStore = useStateStore()
    const caseStore = useCaseStore()
    stateStore.modelResponseField = '头像'
    const params = {
      prompt: `${caseStore.caseContentMarkdown}，中国人，半身近照，在医院门诊拍摄。`,
      // 待加入故事相貌描绘
    }
    return await $fetch('/api/media/face/create', {
      baseURL: stateStore.apiBaseURL,
      method: 'POST',
      body: {
        params: params,
      },
    })
  }

  return {
    getResponse,
  }
}
