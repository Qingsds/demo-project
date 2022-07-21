export enum MessageStatus {
  SENDING /* 发送中 */,
  SENT /* 已发送 */,
  RECEIVING /* 接收中 */,
  RECEIVED /* 已接收 */,
  READED /* 已读 */,
  ERROR /* 发生错误 */,
}

export enum MessageType {
  SEND /* 发送消息类型 */,
  RECEIVED /* 接收消息类型 */,
  SYSTEM /* 系统消息 */,
  NOTIFY /* 通告消息 */,
}

export interface MessageData {
  id: number
  status: MessageStatus
  type: MessageType
  from: number
  to: number
}

export interface TextMessage extends MessageData {
  msg: string
}

export interface ImageMessage extends MessageData {
  url: string
}

export type Message = TextMessage | ImageMessage
