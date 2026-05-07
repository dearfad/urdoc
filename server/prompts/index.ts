// #server/prompts/index.ts

const promptMap = {
  case: {
    generate: () => import('./case/generate'),
  },
  story: {
    generate: () => import('./story/generate'),
  },
  test: {
    generate: () => import('./test/generate'),
  },
}

type PromptType = keyof typeof promptMap
type PromptTask = keyof (typeof promptMap)[PromptType]

export async function getPrompt(type: PromptType, task: PromptTask) {
  const prompt = await promptMap[type]?.[task]?.()
  return prompt?.default ?? ''
}
