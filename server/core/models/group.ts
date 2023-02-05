import { DataTypes, Model } from "sequelize";

import { models } from "./sequelize";

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
