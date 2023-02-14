import { DataTypes, Model } from "sequelize";

import { models } from "./sequelize";

export class User extends Model {
  public id!: number;

  public firstName: string | undefined;
  public lastName: string | undefined;
  public patronymicName: string | undefined;
  public blocked: boolean | undefined;
  public permissions: string[] | undefined;
  public space: number;
  public username!: string;
  public password!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  firstName: {
    type: DataTypes.TEXT
  },
  lastName: {
    type: DataTypes.TEXT
  },
  patronymicName: {
    type: DataTypes.TEXT
  },
  username: {
    type: DataTypes.TEXT
  },
  password: {
    type: DataTypes.TEXT
  },
  blocked: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  permissions: {
    type: DataTypes.JSON
  },
  space: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  }
}, {
  underscored: true,
  sequelize: models.sequelize,
  modelName: 'users'
});
