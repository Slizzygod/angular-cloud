import { DataTypes, Model } from "sequelize";
import { DocumentUser } from "./document-user";
import { Folder } from "./folder";

import { models } from "./sequelize";

export class Document extends Model {

  public id!: number;

  public name!: string | undefined;
  public root!: boolean;
  public extension!: string;
  public folderId: number;

  public documentsUsers?: DocumentUser[];

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

}

Document.init({
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
  extension: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  folderId: {
    type: DataTypes.INTEGER,
  }
}, {
  underscored: true,
  sequelize: models.sequelize,
  modelName: 'documents'
});

Folder.hasMany(Document, { as: 'documents', foreignKey: 'folderId' });
Document.belongsTo(Folder, { as: 'folder', foreignKey: 'folderId' });
