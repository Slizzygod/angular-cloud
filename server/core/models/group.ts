import { DataTypes, Model } from "sequelize";
import { GroupUser } from "./group-user";

import { models } from "./sequelize";
import { User } from "./user";

export class Group extends Model {
  ['setUsers']: any;

  public id!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public name!: string;
  public shortName: string;
  public note: string;
}

Group.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  shortName: {
    type: DataTypes.TEXT
  },
  note: {
    type: DataTypes.TEXT
  }
}, {
  sequelize: models.sequelize,
  modelName: 'groups'
});

Group.belongsToMany(User,
  { as: 'users', through: GroupUser, foreignKey: 'groupId', otherKey: 'userId' }
);
User.belongsToMany(Group,
  { as: 'groups', through: GroupUser, foreignKey: 'userId', otherKey: 'groupId' }
);
