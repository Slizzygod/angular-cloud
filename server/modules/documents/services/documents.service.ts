import { DocumentFavorite, DocumentUser, Document } from "../../../core/models";
import { documentsMapService } from "./documents-map.service";

class DocumentsService {

  async getDocument(id: number, userId: number): Promise<any> {
    const document = await Document.findOne({
      where: { id },
      include: [
        {
          model: DocumentUser,
          as: 'documentsUsers',
          separate: true
        },
        {
          model: DocumentFavorite,
          as: 'favoritesDocuments',
          separate: true
        }
      ]
    });

    const documentMap = await documentsMapService.getDocumentMap(document, userId);

    return documentMap;
  }

}

export const documentsService = new DocumentsService();
