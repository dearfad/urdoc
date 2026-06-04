export const useProviderStore = defineStore('provider', () => {
  function getProviderOptions(provider: string | null, reasoning: boolean) {
    switch (provider) {
      case 'InternAi':
        return { InternAi: { thinking_mode: reasoning } }
      case 'BigModel':
        return { BigModel: { thinking: { type: reasoning ? 'enabled' : 'disabled' } } }
      case 'OpenRouter':
        return { OpenRouter: { reasoning: { effort: reasoning ? 'high' : 'none' } } }
      case 'Agnes':
        return { Agnes: { chat_template_kwargs: { enable_thinking: reasoning } } }
      default:
        return {}
    }
  }
  return { getProviderOptions }
})
