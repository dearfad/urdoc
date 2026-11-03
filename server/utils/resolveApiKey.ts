// 解析模型 apiKey：
// - 内置提供商的 model.apiKey 为 runtimeConfig 键名，从运行时配置读取真实密钥
// - Custom 提供商的 model.apiKey 为用户输入的原始密钥，直接返回
export function resolveApiKey(model: { provider: string; apiKey: string }): string {
  const config = useRuntimeConfig()
  const fromConfig = config[model.apiKey as keyof typeof config] as string | undefined
  if (fromConfig) return fromConfig
  if (model.provider === 'Custom') return model.apiKey
  return ''
}
