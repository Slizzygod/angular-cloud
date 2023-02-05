import { DataTypes, Model } from "sequelize";

import { models } from "./sequelize";

export class Folder extends Model {
  ['setUsers']: any;

  public id!: number;

  public name!: string | undefined;
  public root!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Folder.init({
  name: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  root: {
    type: DataTypes.BOOLEAN
  }
}, {
  underscored: true,
  sequelize: models.sequelize,
  modelName: 'folders'
});

Folder.belongsTo(Folder, { as: 'rootFolder', foreignKey: 'folderId' });
Folder.hasMany(Folder, { as: 'childFolders', foreignKey: 'folderId' });
