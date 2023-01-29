import { DataTypes, Model } from "sequelize";

import { models } from "./sequelize";

export class User extends Model {
  public id!: number;

  public firstName: string | undefined;
  public lastName: string | undefined;
  public patronymicName: string | undefined;
  public email: string | undefined;
  public blocked: boolean | undefined;
  public permissions: string[] | undefined;
  public username!: string;
  public password!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init({
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
  email: {
    type: DataTypes.TEXT
  },
  blocked: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  permissions: {
    type: DataTypes.JSON
  }
}, {
  underscored: true,
  sequelize: models.sequelize,
  modelName: 'users'
});
