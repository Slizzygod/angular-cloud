import { DataTypes, Model } from "sequelize";
import { models } from "./sequelize";

import { Folder } from "./folder";
import { User } from "./user";

export class FolderUser extends Model {
  public id!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public folderId!: number;
  public userId!: number;
  public owner: boolean;
  public favorite: boolean;

  folder?: Folder;
  user?: User;
}

FolderUser.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  folderId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  owner: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  favorite: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  sequelize: models.sequelize,
  modelName: 'folders_users',
});

User.hasMany(FolderUser, { as: 'foldersUsers', foreignKey: 'userId' });
FolderUser.belongsTo(User, { as: 'user', foreignKey: 'userId' });

Folder.hasMany(FolderUser, { as: 'foldersUsers', foreignKey: 'folderId' });
FolderUser.belongsTo(Folder, { as: 'folder', foreignKey: 'folderId' });
