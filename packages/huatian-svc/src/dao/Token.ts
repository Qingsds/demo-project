/* dao data account object 数据访问对象 */
import crypto from 'crypto'

export type TokenObject = {
  uid: number
  expires: number
  token: string
}

export class Token {
  private static instance: Token
  // 缓存 token
  private cache: Record<string, TokenObject> = {}
  private constructor() {}
  public static getInstance() {
    if (!Token.instance) {
      Token.instance = new Token()
    }
    return Token.instance
  }

  private create(uid: number) {
    const token = Math.random() + '-' + new Date().getTime()
    const expires = new Date().getTime() + 3600 * 24
    // 计算 hash
    const sha = crypto.createHash('sha1')
    sha.update(token)
    const hash = sha.digest('hex')
    console.log(hash)
    const returnResult: TokenObject = {
      uid,
      token: hash,
      expires,
    }
    // 缓存 token
    this.setTokenCache(returnResult.token, returnResult)

    return returnResult
  }

  private getTokenCache(hash: string) {
    return this.cache[hash] || null
  }
  private setTokenCache(hash: string, token: TokenObject) {
    this.cache[hash] = token
  }

  // 刷新 token
  public refreshToken(uid: number) {
    return this.create(uid)
  }

  public getToken(hash: string) {
    const token = this.getTokenCache(hash)
    if (token && token.expires > new Date().getTime()) {
      return token
    }
    return null
  }
}
