export default function () {
  const stateStore = useStateStore()
  const promptStore = usePromptStore()
  const recordStore = useRecordStore()
  function getSystemPrompt(systemPromptType: SystemPromptType): Messages {
    let content = ''
    switch (systemPromptType) {
      case 'case':
        content = `系统要点设定：\n${stateStore.customConfig.case}${Object.values(
          stateStore.bookScope
        ).join('\n')}\n`
        break
      case 'story':
        content = `系统要点设定：\n${stateStore.customConfig.story}\n${recordStore.view.case.markdown}`
        break
      case 'test':
        content = `系统要点设定：\n${stateStore.customConfig.test}\n${recordStore.view.case.markdown}\n${recordStore.view.story.markdown}`
        break
      case 'act':
        content = `下面是用户提供的病历：\n${recordStore.view.case.markdown}`
        break
      case 'rate':
        content = `下面是用户提供的题库：\n${recordStore.view.test.markdown}`
        break
      case 'face':
        content = `系统要点设定：\n${stateStore.customConfig.face}`
        break
      default:
        content = '系统要点设定：无特殊要求'
        break
    }
    return [
      { role: 'system', content: promptStore.prompts.system[systemPromptType].current },
      {
        role: 'user',
        content: content,
      },
    ]
  }
  return { getSystemPrompt }
}
