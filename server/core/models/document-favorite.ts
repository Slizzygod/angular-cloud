import { DataTypes, Model } from "sequelize";
import { Document } from "./document";

import { models } from "./sequelize";
import { User } from "./user";

export class DocumentFavorite extends Model {
  public id!: number;

  public documentId!: number;
  public userId!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

DocumentFavorite.init({
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
}, {
  underscored: true,
  sequelize: models.sequelize,
  modelName: 'documents_favorites'
});

User.hasMany(DocumentFavorite, { as: 'favoritesDocuments', foreignKey: 'userId' });
DocumentFavorite.belongsTo(User, { as: 'user', foreignKey: 'userId' });

Document.hasMany(DocumentFavorite, { as: 'favoritesDocuments', foreignKey: 'documentId' });
DocumentFavorite.belongsTo(Document, { as: 'document', foreignKey: 'documentrId' });
