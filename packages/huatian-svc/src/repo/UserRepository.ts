import { User } from '@huatian/model'

export class UserRepository {
  private users: Record<number, User> = {}
  private static instance: UserRepository

  private constructor() {}

  public static getInstance() {
    if (!UserRepository.instance) {
      UserRepository.instance = new UserRepository()
    }
    return UserRepository.instance
  }

  public getUser(uid: number): User
  public getUser(username: string, password: string): User
  public getUser(identity: string | number, password?: string): User {
    if (typeof identity === 'number') {
      const uid = identity
      if (this.users[uid]) {
        return this.users[uid]
      }
      const newUser = new User(uid)
      this.users[uid] = newUser
      return newUser
    } else {
      const user = identity
      const idMap = {
        zhangsan: 1,
        lisi: 2,
        wangwu: 3,
      }

      return this.getUser(idMap[user] || 1)
    }
  }
}
