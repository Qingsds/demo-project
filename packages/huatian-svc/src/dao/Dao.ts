import { Model, Optional, DataTypes } from 'sequelize'
import { DB } from './DB'
interface ChatIdSetAttributes {
  id: number
  app: string
  start: number
}

export class ChatIdSetDao extends Model<
  ChatIdSetAttributes,
  Optional<ChatIdSetAttributes, 'id'>
> {}

ChatIdSetDao.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    app: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    start: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
  },
  { sequelize: DB.getSequelize(), tableName: 'id_set ' }
)
