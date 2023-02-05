import { DataTypes, Model } from "sequelize";
import { Folder } from "./folder";

import { models } from "./sequelize";
import { User } from "./user";

export class FolderFavorite extends Model {
  public id!: number;

  public folderId!: number;
  public userId!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

FolderFavorite.init({
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
}, {
  underscored: true,
  sequelize: models.sequelize,
  modelName: 'folders_favorites'
});

User.hasMany(FolderFavorite, { as: 'favoritesFolders', foreignKey: 'userId' });
FolderFavorite.belongsTo(User, { as: 'user', foreignKey: 'userId' });

Folder.hasMany(FolderFavorite, { as: 'favoritesFolders', foreignKey: 'folderId' });
FolderFavorite.belongsTo(Folder, { as: 'folder', foreignKey: 'folderId' });
