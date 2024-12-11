type RoleType = 'system' | 'user' | 'assistant'
interface MessageInterface {
    role: RoleType
    content: string
}
type MessagesArray = MessageInterface[]
