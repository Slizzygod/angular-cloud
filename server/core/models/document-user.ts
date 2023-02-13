import { DataTypes, Model } from "sequelize";
import { models } from "./sequelize";

import { User } from "./user";
import { Document } from "./document";

export class DocumentUser extends Model {
  public id!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public documentId!: number;
  public userId!: number;
  public owner: boolean;
  public favorite: boolean;

  document?: Document;
  user?: User;
}

DocumentUser.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  documentId: {
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
  modelName: 'documents_users',
});

User.hasMany(DocumentUser, { as: 'documentsUsers', foreignKey: 'userId' });
DocumentUser.belongsTo(User, { as: 'user', foreignKey: 'userId' });

Document.hasMany(DocumentUser, { as: 'documentsUsers', foreignKey: 'documentId' });
DocumentUser.belongsTo(Document, { as: 'document', foreignKey: 'documentId' });
