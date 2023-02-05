import { DataTypes, Model } from "sequelize";
import { Folder } from "./folder";

import { models } from "./sequelize";
import { User } from "./user";

export class Log extends Model {
  public id!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public alias!: string;
  public method!: string;
  public userId!: number;
  public data: any;
  public folderId: number;
  public documentId: number;
}

Log.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  alias: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  method: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  data: {
    type: DataTypes.JSON,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  folderId: {
    type: DataTypes.INTEGER
  },
  documentId: {
    type: DataTypes.INTEGER
  }
}, {
  sequelize: models.sequelize,
  modelName: 'logs'
});

Log.belongsTo(User, { as: 'user', foreignKey: 'userId' });
Log.belongsTo(Folder, { as: 'folder', foreignKey: 'folderId' });
