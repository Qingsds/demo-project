import path from 'path'
import { Sequelize } from 'sequelize'

export class DB {
  private static instance: Sequelize
  private constructor() {}
  public static getSequelize() {
    if (!DB.instance) {
      DB.instance = new Sequelize({
        dialect: 'sqlite',
        storage: path.resolve(__dirname, 'mydb.db'),
      })
    }
    return DB.instance
  }
}
