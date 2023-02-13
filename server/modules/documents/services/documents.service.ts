import * as fsPromises from 'fs/promises';
import * as fs from 'fs';
import * as path from 'path';

import { Op } from 'sequelize';

import { logsService } from '../../logs/logs.service';
import { documentsMapService } from "./documents-map.service";
import { foldersService } from '../../folders/services';

import { DocumentUser, Document, User, DocumentsOptions } from "../../../core/models";

class DocumentsService {

  async getDocuments(data: DocumentsOptions): Promise<Document[]> {
    const { user, folderId, owner, favorites } = data;

    let documentCondition: any = { root: true };
    let documentUserCondition: any = { userId: user.id };

    if (owner) {
      documentUserCondition.owner = true
    }

    if (!favorites && !folderId && !owner) {
      documentUserCondition.owner = { [Op.or]: [false, null] };
    }

    if (favorites) {
      documentCondition = {};
      documentUserCondition.favorite = true;
    }

    if (!isNaN(folderId)) {
      documentUserCondition = {};
      documentCondition = { folderId };
    }

    return await Document.findAll({
      where: documentCondition,
      include: [
        {
          model: DocumentUser,
          as: 'documentsUsers',
          where: documentUserCondition
        }
      ]
    });
  }

  async getDocument(id: number, userId?: number): Promise<any> {
    const document = await Document.findOne({
      where: { id },
      include: [
        {
          model: DocumentUser,
          as: 'documentsUsers',
          separate: true,
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['username']
            }
          ]
        }
      ]
    });

    const documentMap = await documentsMapService.getDocumentMap(document, userId);

    return documentMap;
  }

  async deleteDocument(id: number, user: User): Promise<any> {
    const document = await Document.findOne({ where: { id } });
    const folderPath = await foldersService.getFolderPath(document.folderId, user.username);

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

  async createDocument(options: DocumentsOptions): Promise<any> {
    const { name, folderId, extension, root, user } = options;
    const folderPath = await foldersService.getFolderPath(folderId, user.username);

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

  async uploadDocument(data: DocumentsOptions): Promise<any> {
    const { buffer, name, folderId, user } = data;

    const folderPath = await foldersService.getFolderPath(folderId, user.username);

    await fsPromises.writeFile(`${folderPath}/${name}`, buffer);

    const parsedExtension = path.extname(name).slice(1);
    const parsedName = path.parse(name).name;

    const createdDocument = await Document.create({
      folderId: folderId || null,
      name: parsedName,
      extension: parsedExtension,
      root: folderId ? false : true
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

  async moveDocument(data: DocumentsOptions): Promise<any> {
    const { id, destFolderId, user } = data;

    const document = await this.getDocument(id, user.id);
    const documentPath = `${document.name}.${document.extension}`;
    const folderPath = await foldersService.getFolderPath(document.folderId, document.ownerUser.username);
    const destFolderPath = await foldersService.getFolderPath(destFolderId);

    await Promise.all([
      fsPromises.rename(`${folderPath}/${documentPath}`, `${destFolderPath}/${documentPath}`),
      Document.update({ root: false, folderId: destFolderId }, { where: { id } })
    ]);
  }

}

export const documentsService = new DocumentsService();
