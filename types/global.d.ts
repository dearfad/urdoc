// Message
type RoleType = 'system' | 'user' | 'assistant'
interface MessageInterface {
    role: RoleType
    content: string
}
type MessagesArray = MessageInterface[]

// response_format
type ResponseFormatType = { type: 'text' } | { type: 'json_object' }
type ModelParamsType = {
    apiKey: string
    model: string
    url: string
    messages: MessagesArray
    watchFields: string[]
    responseFormat: ResponseFormatType
}

// bigmodel cogview model response
// https://bigmodel.cn/dev/api/image-model/cogview
type BigmodelCogviewResponseData = {
    url: string //图片链接。图片的临时链接有效期为 30天，请及时转存图片。
}
type BigmodelCogviewResponseContentFilter = {
    role: string // 安全生效环节，包括 role = assistant 模型推理，role = user 用户输入，role = history 历史上下文
    level: Integer //	严重程度 level 0-3，level 0表示最严重，3表示轻微
}
type BigmodelCogviewResponse = {
    created: string //请求创建时间，是以秒为单位的Unix时间戳。
    data: BigmodelCogviewResponseData[] //	数组，包含生成的图片 URL。目前数组中只包含一张图片。
    content_filter: BigmodelCogviewResponseContentFilter[] //返回内容安全的相关信息。
}
