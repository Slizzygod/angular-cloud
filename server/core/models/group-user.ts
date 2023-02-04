import { DataTypes, Model } from "sequelize";

import { models } from "./sequelize";

export class GroupUser extends Model {
  public id!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public groupId!: number;
  public userId!: number;
}

GroupUser.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  groupId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
}, {
  sequelize: models.sequelize,
  modelName: 'groups_users',
});
