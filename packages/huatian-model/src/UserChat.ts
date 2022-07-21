import { ChatSession } from './ChatSession'
import { Message, MessageStatus, MessageType } from './Message'
import { User } from './User'

export class UserChat {
  private user: User
  private messages: Array<Message> = []
  private sessions: Record<number, ChatSession> = {}

  public constructor(user: User) {
    this.user = user
  }

  /* 创建会话 */
  public createSession(to: User) {
    if (this.sessions[to.getId()]) {
      return this.sessions[to.getId()]
    }
    const session = new ChatSession(this.user, to)
    this.sessions[to.getId()] = session
    return session
  }

  /* 发送的消息 */
  public send(msg: Message) {
    this.messages.push(msg)
    msg.status = MessageStatus.SENT
    msg.type = MessageType.SEND
  }
  /* 接收消息 */
  public receive(msg: Message) {
    this.messages.push(msg)
    msg.status = MessageStatus.RECEIVING
    msg.type = MessageType.RECEIVED
  }

  public readTo(lastId: number) {
    const unreads = this.messages.filter(
      msg => msg.id >= lastId && msg.status === MessageStatus.RECEIVED
    )
    unreads.forEach(msg => {
      msg.status = MessageStatus.READED
    })
  }

  // 获取未读消息
  public unreadMessage(lastId: number) {
    // client id(最后一条消息)
    return this.messages.filter(msg => msg.id > lastId)
  }
}
