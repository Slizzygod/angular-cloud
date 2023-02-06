import { Document } from "../../../core/models";

class DocumentsMapService {

  getDocumentsMap(documents: Document[]): any[] {
    let documentsMap = [];

    if (Array.isArray(documents) && documents.length > 0) {
      documentsMap = documents.map((document: Document) => this.getDocumentMap(document));
    }

    return documentsMap;
  }

  getDocumentMap(document: Document): any {
    return {
      id: document.id,
      name: document.name,
      extension: document.extension,
      owner: document.documentsUsers[0].owner,
      favorite: !!document.favoritesDocuments[0],
      root: document.root,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt
    };
  }

}

export const documentsMapService = new DocumentsMapService();
