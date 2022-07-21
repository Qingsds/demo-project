import { UserChat } from './UserChat'
export class User {
  private id: number
  private _chat: UserChat

  public constructor(id: number) {
    this.id = id
    this._chat = new UserChat(this)
  }

  public getId() {
    return this.id
  }
  public chat() {
    return this._chat
  }
}
