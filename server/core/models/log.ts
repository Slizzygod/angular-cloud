import { DataTypes, Model } from "sequelize";

import { models } from "./sequelize";
import { User } from "./user";
import { Document } from "./document";
import { Folder } from "./folder";

export class Log extends Model {
  public id!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public alias!: string;
  public method!: string;
  public data: any;
  public folderId: number;
  public userId: User;
  public folder: Folder;
  public document: Document;
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
  user: {
    type: DataTypes.JSON,
  },
  folder: {
    type: DataTypes.JSON,
  },
  document: {
    type: DataTypes.JSON,
  },
}, {
  sequelize: models.sequelize,
  modelName: 'logs'
});
