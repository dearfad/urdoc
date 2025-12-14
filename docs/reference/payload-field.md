# 请求字段

## /function/model

### Payload

```js
const payload = {
  // 判断1：提供apiKey可使用任意模型，否则仅可使用免费模型
  apiKey: 'sk-xxxxxxxxxxxxxxxx',
  // 判断2：如果存在且不为空则使用，否则使用默认apiKeyName
  apiKeyName: 'MODEL_SECRECT_API_KEY',
  model 'glm-4-flash-250414',
  messages: [
    {
        role: 'system',
        content: '你是一个助手，请按照我的要求生成内容。'
    },
    {
        role: 'user',
        content: '请生成一个10个字左右的句子。'
    }
  ]
  stream: true,
  format: 'json',
}
```
