import { Message } from '@huatian/model'
import { UserRepository } from '../repo/UserRepository'
import { ChatIdService } from '../service/chatIdService'

/**
 * 聊天上下文
 */
export class ChatContext {
  private static instance: ChatContext
  private constructor() {}
  public static getInstance() {
    if (!ChatContext.instance) {
      ChatContext.instance = new ChatContext()
    }
    return ChatContext.instance
  }

  public async send(uid: number, message: Message) {
    message.from = uid
    const sentMessage = { ...message }
    const receiveMessage = { ...message }

    const chatIdService = ChatIdService.getInstance()
    sentMessage.id = await chatIdService.getId()
    receiveMessage.id = await chatIdService.getId()

    const repo = UserRepository.getInstance()
    const from = repo.getUser(message.from)
    const to = repo.getUser(message.to)

    const session = from.chat().createSession(to)
    session.chat(sentMessage, receiveMessage)
    return sentMessage.id
  }

  public read(uid: number, lastId: number) {
    const repo = UserRepository.getInstance()
    const user = repo.getUser(uid)

    return user.chat().unreadMessage(lastId)
  }
}
