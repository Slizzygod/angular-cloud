import { DataTypes, Model } from "sequelize";
import { FolderUser } from "./folder-user";
import { User } from "./user";

import { models } from "./sequelize";

export interface FoldersOptions {
  id?: number
  user?: User;
  name?: string;
  root?: boolean;
  parentId?: number;
  group?: number;
  owner?: boolean;
  favorites?: boolean;
  joint?: boolean;
}

export class Folder extends Model {
  ['setUsers']: any;

  public id!: number;

  public name!: string | undefined;
  public root!: boolean;
  public parentId: number;
  public group: number;

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
