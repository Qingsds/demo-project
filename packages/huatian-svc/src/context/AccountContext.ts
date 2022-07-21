import { UserRepository } from '../repo/UserRepository'

/**
 * 用户信息上下文
 */
export class AccountContext {
  private static instance: AccountContext | null = null
  private repo: UserRepository = UserRepository.getInstance()

  private constructor() {}

  public static getInstance() {
    if (AccountContext.instance === null) {
      AccountContext.instance = new AccountContext()
    }
    return AccountContext.instance
  }

  public async verify(username: string, password: string) {
    const user = this.repo.getUser(username, password)
    return user
  }
}
