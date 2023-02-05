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

  folder?: Folder;
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
  }
}, {
  sequelize: models.sequelize,
  modelName: 'folders_users',
});

Folder.belongsToMany(User,
  { as: 'users', through: FolderUser, foreignKey: 'folderId', otherKey: 'userId' }
);
User.belongsToMany(Folder,
  { as: 'folders', through: FolderUser, foreignKey: 'userId', otherKey: 'folderId' }
);

FolderUser.belongsTo(User, { as: 'user', foreignKey: 'userId' });
FolderUser.belongsTo(Folder, { as: 'folder', foreignKey: 'folderId' });
