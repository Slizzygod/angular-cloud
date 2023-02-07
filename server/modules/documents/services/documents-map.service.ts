import { Document, DocumentUser } from "../../../core/models";

class DocumentsMapService {

  async getDocumentsMap(documents: Document[], userId: number): Promise<any[]> {
    let documentsMap = [];

    if (Array.isArray(documents) && documents.length > 0) {
      const documentUsers = await DocumentUser.findAll({ where: { documentId: documents.map((el: Document) => el.id) } });

      documentsMap = documents.map((document: Document) => this.getDocumentMap(document, userId, documentUsers));
    }

    return documentsMap;
  }

  getDocumentMap(document: Document, userId: number, documentUsers: DocumentUser[] = []): any {
    return {
      id: document.id,
      name: document.name,
      extension: document.extension,
      owner: !!document.documentsUsers.find((el: DocumentUser) => el.userId === userId && el.owner),
      shared: documentUsers.filter((el: DocumentUser) => !el.owner && el.documentId === document.id).map((el: DocumentUser) => el.userId),
      favorite: !!document.favoritesDocuments[0],
      root: document.root,
      documentsUsers: document.documentsUsers || [],
      createdAt: document.createdAt,
      updatedAt: document.updatedAt
    };
  }

}

export const documentsMapService = new DocumentsMapService();
