import express, { NextFunction, Request, Response } from 'express'
import cookieParser from 'cookie-parser'
import { AccountContext } from './context/AccountContext'
import { Token } from './dao/Token'
import { ChatContext } from './context/ChatContext'
import { Message } from '@huatian/model'
const app = express()
app.use(cookieParser())

interface LoginRequest extends Request {
  uid: number
}

async function sendStdResponse<T>(res: Response, f: T)
async function sendStdResponse(res: Response, f: Promise<any>)
async function sendStdResponse(res: Response, f: () => Promise<any>)
async function sendStdResponse(res: Response, f: any) {
  try {
    let data = typeof f === 'function' ? f() : f
    if (data instanceof Promise) {
      data = await data
    }
    res.send({
      success: true,
      data,
    })
  } catch (ex: any) {
    console.error(ex)
    res.status(500).send({
      success: false,
      message: ex.toString(),
    })
  }
}

/* token 中间件 */
async function token(req: LoginRequest, res: Response, next: NextFunction) {
  const tokenHash = req.cookies['x-token'] as string
  console.log(tokenHash)
  const tokenInstance = Token.getInstance()
  const token = tokenInstance.getToken(tokenHash)

  if (token === null) {
    res.status(401).send({
      success: false,
    })
    return
  }
  req.uid = token.uid
  next()
}

app.get('/foo', token, (req: LoginRequest, res) => {
  res.send(req.uid + 'ok')
})
// 登录接口
app.post('/token', express.json(), async (req, res) => {
  const { username, password } = req.body
  const account = AccountContext.getInstance()
  const user = await account.verify(username, password)
  const tokenInstance = Token.getInstance()
  const token = tokenInstance.refreshToken(user.getId())

  res.cookie('x-token', token.token)
  sendStdResponse(res, 'ok')
})

/* 发送消息 */
app.post(
  '/message',
  token,
  express.json(),
  async (req: LoginRequest, res: Response) => {
    const uid = req.uid

    const chatContext = ChatContext.getInstance()
    sendStdResponse(res, async () => {
      return await chatContext.send(uid, req.body as Message)
    })
  }
)

/* 读取消息 */
app.get('/message', token, (req: LoginRequest, res: Response) => {
  const uid = req.uid
  const lastId = parseInt(req.query.last_id as string)
  const chatContext = ChatContext.getInstance()
  sendStdResponse(res, () => {
    return chatContext.read(uid, lastId)
  })
})
app.listen(6001, () => {
  console.log('listen at 6001')
})
