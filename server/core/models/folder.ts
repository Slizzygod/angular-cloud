import { DataTypes, Model } from "sequelize";
import { FolderFavorite } from "./folder-favorite";
import { FolderUser } from "./folder-user";

import { models } from "./sequelize";

export class Folder extends Model {
  ['setUsers']: any;

  public id!: number;

  public name!: string | undefined;
  public root!: boolean;
  public parentId: number;
  public group: number;

  public favoritesFolders?: FolderFavorite[];
  public foldersUsers?: FolderUser[];

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Folder.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  root: {
    type: DataTypes.BOOLEAN
  },
  parentId: {
    type: DataTypes.INTEGER,
  },
  group: {
    type: DataTypes.INTEGER,
  }
}, {
  underscored: true,
  sequelize: models.sequelize,
  modelName: 'folders'
});

Folder.belongsTo(Folder, { as: 'rootFolder', foreignKey: 'parentId', onDelete: 'CASCADE' });
Folder.hasMany(Folder, { as: 'childFolders', foreignKey: 'parentId' });
