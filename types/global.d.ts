// Cstar

// Knowledge framework

// Medical Record

interface Case {
  姓名: string
  性别: string
  年龄: string
  主诉: string
  现病史?: string
  既往史?: string
  查体?: string
  专科查体?: string
  辅助检查?: string
  诊断: string
  治疗?: string
  手术?: string
  病理?: string
}
type Cases = Case[]

interface Test {
  问题: string
  选项: {
    [option: string]: string
  }
  答案: string
}
type Tests = Test[]

interface MedicalRecord {
  case: Case
  story: string
  tests: Tests
  act: string
  rate: string
  face: string
  voice: string
  pose: string
}
type MedicalRecords = MedicalRecord[]

// Message
type Role = 'system' | 'user' | 'assistant'
interface Message {
  role: Role
  content: string
}
type Messages = Message[]

// Tags
interface Tags {
  case: string
  story: string
  test: string
}

// Fields
interface Fields {
  case: string[]
}

// Model
type ResponseFormatType = { type: 'text' } | { type: 'json_object' }

type ModelParamsType = {
  model: {
    gateway: string
    provider: string
    name: string
    id: string
    url: string
    key: { gateway: string; provider: string }
  }
  messages?: MessagesArray
  watchFields?: string[]
  responseFormat?: ResponseFormatType
  prompt?: string
}

// SSE STREAM
type SseStream = {
  id?: string
  object?: string
  created?: string
  model?: string
  system_fingerprint?: string
  choices: [
    {
      index?: number
      delta: {
        role?: string
        content: string
        reasoning_content?: string
      }
      finish_reason?: string | null
    }
  ]
  note?: string
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
type BigmodelCogvideoxIdResponse = {
  request_id: string // 用户在客户端请求时提交的任务编号或者平台生成的任务编号
  id: string // 智谱AI开放平台生成的任务订单号，调用请求结果接口时请使用此订单号
  model: string // 本次调用的模型名称
  task_status: string // 处理状态，PROCESSING（处理中），SUCCESS（成功），FAIL（失败）。需通过查询获取结果
}
type BigmodelCogvideoxResponse = {
  model: string // 模型名称
  video_result: List // 视频生成结果
  url: string // 视频url
  cover_image_url: string // 视频封面url
  task_status: string // 处理状态，PROCESSING（处理中），SUCCESS（成功），FAIL（失败） 注：处理中状态需通过查询获取结果
  request_id: string // 用户在客户端请求时提交的任务编号或者平台生成的任务编号
  id: string // 智谱 AI 开放平台生成的任务id，调用请求结果接口时请使用此id
}
