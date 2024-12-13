// Message
type RoleType = 'system' | 'user' | 'assistant'
interface MessageInterface {
    role: RoleType
    content: string
}
type MessagesArray = MessageInterface[]

// response_format
type ResponseFormatType = { type: 'text' } | { type: 'json_object' }
