import { generateImage } from 'ai'
import { createOpenAICompatible } from '@ai-sdk/openai-compatible'

export default defineEventHandler(async (event) => {
  const { prompt, model, n, size, providerOptions } = await readBody(event)
  const config = useRuntimeConfig()
  const provider = createOpenAICompatible({
    name: model.provider,
    apiKey: config[model.apiKey as string] as string,
    baseURL: model.baseURL,
  })
  return generateImage({
    model: provider.imageModel(model.name),
    prompt,
    n,
    size,
    providerOptions,
  })
})
