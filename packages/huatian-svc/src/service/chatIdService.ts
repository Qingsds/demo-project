import { ChatIdSetDao } from '../dao/DAO'
import { DB } from '../dao/DB'

export const STEP = 100000

export class ChatIdService {
  private static instance: ChatIdService
  private base_id: number = -1
  private start_id: number = 0

  private constructor() {}
  public static getInstance() {
    if (!ChatIdService.instance) {
      ChatIdService.instance = new ChatIdService()
    }
    return ChatIdService.instance
  }

  private async requestIdSet() {
    if (this.base_id >= this.start_id && this.base_id < this.start_id + STEP) {
      return
    }
    const sequelize = DB.getSequelize()
    const transaction = await sequelize.transaction()

    try {
      const lastRecord = await ChatIdSetDao.findOne({
        // id倒叙 这里上锁解决并发问题
        order: [['id', 'desc']],
        lock: transaction.LOCK.UPDATE,
      })
      const nextStartNumber = lastRecord
        ? lastRecord.getDataValue('start') + STEP
        : 0
      await ChatIdSetDao.create({
        start: nextStartNumber,
        app: 'test',
      })

      this.base_id = nextStartNumber
      this.start_id = nextStartNumber 
    } catch (ex) {
      // 发生异常进行回滚
      console.error(ex)
      transaction.rollback()
    }
  }

  public async getId() {
    await this.requestIdSet()
    return this.base_id++
  }
}
