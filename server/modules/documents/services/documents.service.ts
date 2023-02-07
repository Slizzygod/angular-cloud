import * as fsPromises from 'fs/promises';
import * as fs from 'fs';
import * as path from 'path';
import * as fsFinder from 'fs-finder';

import { config } from '../../../core/config/config';

import { DocumentFavorite, DocumentUser, Document, User, Folder, FolderUser } from "../../../core/models";
import { logsService } from '../../logs/logs.service';
import { documentsMapService } from "./documents-map.service";

class DocumentsService {

  async getFolderPath(user: User, folderId: number): Promise<string> {
    let folderPath = `${config.rootDir}/${user.username}`;

    if (folderId) {
      const folderUser = await FolderUser.findOne({
        where: { folderId, owner: true },
        include: [
          {
            model: Folder,
            as: 'folder',
            attributes: ['name', 'id']
          },
          {
            model: User,
            as: 'user',
            attributes: ['username']
          }
        ]
      });

      folderPath = fsFinder
        .from(`${config.rootDir}/${folderUser.user.username}`)
        .findDirectories(`${folderUser.folder.name}_${folderUser.folder.id}`)[0];
    }

    return folderPath;
  }

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

  async deleteDocument(id: number, parent: number, user: User): Promise<any> {
    const folderPath = await this.getFolderPath(user, parent);
    const document = await Document.findOne({ where: { id } });

    await Promise.all([
      fsPromises.rm(`${folderPath}/${document.name}.${document.extension}`),
      Document.destroy({ where: { id } }),
      logsService.createLog({
        alias: 'deleteDocument',
        method: 'DELETE',
        user,
        document,
      }),
    ]);
  }

  async createDocument(name: string, root: boolean, folderId: number, extension: string, user: User): Promise<any> {
    const folderPath = await this.getFolderPath(user, folderId);

    const data = await Document.create({ name, root, folderId, extension, userId: user.id });

    await DocumentUser.create({ userId: user.id, documentId: data.id });
    fs.closeSync(fs.openSync(`${folderPath}/${name}.${extension}`, 'w'));

    const document = await documentsService.getDocument(data.id, user.id)

    await logsService.createLog({
      alias: 'createDocument',
      method: 'POST',
      data: { name, root, folderId },
      user,
      document,
    });

    return document;
  }

  async saveDocument(data: Buffer, name: string, parent: number, user: User): Promise<any> {
    const folderPath = await this.getFolderPath(user, parent);

    await fsPromises.writeFile(`${folderPath}/${name}`, data);

    const parsedExtension = path.extname(name).slice(1);
    const parsedName = path.parse(name).name;

    const createdDocument = await Document.create({
      folderId: parent || null,
      name: parsedName,
      extension: parsedExtension,
      root: parent ? true : false
    });

    await DocumentUser.create({ documentId: createdDocument.id, userId: user.id, owner: true });

    const document = await this.getDocument(createdDocument.id, user.id);

    await logsService.createLog({
      alias: 'createDocument',
      method: 'POST',
      data: { name, root: true, folderId: null },
      user,
      document,
    });

    return document;
  }

}

export const documentsService = new DocumentsService();
