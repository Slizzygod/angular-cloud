import * as fs from 'fs';
import * as fsPromises from 'fs/promises';
import * as mime from 'mime-types';

import { Request, Response } from 'express';

import { DocumentUser, Document } from '../../core/models';

import { usersService } from '../users/users.service';
import { documentsMapService, documentsService } from './services';
import { foldersService } from '../folders/services';

export class DocumentsCtrl {

  async getDocuments(req: Request, res: Response): Promise<any> {
    const owner = Boolean(req.query.owner);
    const favorites = Boolean(req.query.favorites);
    const joint = Boolean(req.query.joint);
    const folderId = Number(req.query.folderId);

    const user = usersService.getCurrentSessionUser(req);

    try {
      const documents = await documentsService.getDocuments({ owner, favorites, joint, folderId, user });
      const documentsMap = await documentsMapService.getDocumentsMap(documents, user.id);

      res.send(documentsMap);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  async getDocument(req: Request, res: Response): Promise<any> {
    const id = Number(req.params.id);

    const user = usersService.getCurrentSessionUser(req);

    try {
      const document = await documentsService.getDocument(id, user.id);
      const folderPath = await foldersService.getFolderPath(document.folderId, document.ownerUser.username);
      const data = await fsPromises.readFile(`${folderPath}/${document.name}.${document.extension}`);

      res.json(data.toString());
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  async saveDocument(req: Request, res: Response): Promise<any> {
    const id = Number(req.params.id);
    const text = req.body.text;

    const user = usersService.getCurrentSessionUser(req);

    try {
      const document = await documentsService.getDocument(id, user.id);
      const folderPath = await foldersService.getFolderPath(document.folderId, document.ownerUser.username);

      await fsPromises.writeFile(`${folderPath}/${document.name}.${document.extension}`, text);

      res.json({ id });
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  async updateDocument(req: Request, res: Response): Promise<any> {
    const id = Number(req.params.id);
    const name = req.body.name;

    const user = usersService.getCurrentSessionUser(req);

    if (!name) {
      return res.status(412).send('Document name is required');
    }

    try {
      const documents = await Document.findAll({ where: { name } });

      if (documents.length > 0) {
        return res.status(400).send('Name must be unique');
      }

      await documentsService.updateDocument({ id, name, user });

      res.json({ id });
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  async createDocument(req: Request, res: Response): Promise<any> {
    const name = req.body.name;
    const root = Boolean(req.body.root);
    const folderId = Number(req.body.folderId);
    const extension = req.body.extension;
    const data = { name, root, folderId: null, extension };

    const user = usersService.getCurrentSessionUser(req);

    if (!name) {
      return res.status(412).send('Folder name is required');
    }

    if (!extension) {
      return res.status(412).send('Folder extension is required');
    }

    if (!isNaN(folderId)) {
      data.folderId = folderId;
    }

    try {
      const document = await documentsService.createDocument({
        name: data.name,
        root: data.root,
        folderId: data.folderId,
        extension: data.extension,
        user
      });

      res.send(document);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  async deleteDocument(req: Request, res: Response): Promise<any> {
    const id = Number(req.params.id);

    const user = usersService.getCurrentSessionUser(req);

    try {
      await documentsService.deleteDocument(id, user);

      res.json({ id });
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  async setDocumentFavorite(req: Request, res: Response): Promise<any> {
    const id = Number(req.params.id);

    const user = usersService.getCurrentSessionUser(req);

    try {
      const document = await DocumentUser.findOne({ where: { userId: user.id, documentId: id } });

      if (!document) {
        return res.status(400).send('Document is not defined');
      }

      await document.update({ favorite: !Boolean(document.favorite) });

      res.json({ id });
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  async shareDocument(req: Request, res: Response): Promise<any> {
    const id = Number(req.params.id);
    const users = req.body.users || [];

    try {
      await DocumentUser.destroy({ where: { documentId: id, owner: false } });

      if (users.length > 0) {
        await DocumentUser.bulkCreate(users.map((el: number) => ({ userId: el, documentId: id, owner: false })));
      }

      res.json({ id });
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  async uploadDocument(req: Request, res: Response): Promise<any> {
    const folderId = Number(req.query.folderId);
    const file = req['files'].thumbnail;

    const user = usersService.getCurrentSessionUser(req);

    try {
      const freeSpace = await foldersService.checkFreeSpace(user, folderId, file.size);

      if (!freeSpace) {
        return res.status(400).send('No free space, contact your administrator');
      }

      const folder = await documentsService.uploadDocument({ buffer: file.data, name: file.name, folderId, user });

      res.json(folder)
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  async downloadDocument(req: Request, res: Response): Promise<any> {
    const id = Number(req.params.id);

    const user = usersService.getCurrentSessionUser(req);

    try {
      const document = await documentsService.getDocument(id, user.id);
      const folderPath = await foldersService.getFolderPath(document.folderId, document.ownerUser.username);

      const rs = fs.createReadStream(`${folderPath}/${document.name}.${document.extension}`);

      res.setHeader("Content-Disposition", "attachment;");
      res.set('Content-Type', mime.lookup(document.extension));

      rs.pipe(res);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  async moveDocument(req: Request, res: Response): Promise<any> {
    const id = Number(req.params.id);
    const destFolderId = Number(req.body.destFolderId);

    const user = usersService.getCurrentSessionUser(req);

    if (isNaN(destFolderId)) {
      return res.status(412).send('Destination folder id required');
    }

    try {
      await documentsService.moveDocument({ id, destFolderId, user });

      res.json({ id });
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

}

export const documentsCtrl = new DocumentsCtrl();
