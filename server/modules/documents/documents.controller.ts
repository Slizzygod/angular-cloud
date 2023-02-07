import * as fs from 'fs';
import * as fsPromises from 'fs/promises';
import * as mime from 'mime-types';

import { Request, Response } from 'express';
import { Op } from 'sequelize';

import { Document, DocumentFavorite, DocumentUser } from '../../core/models';
import { usersService } from '../users/users.service';
import { documentsMapService, documentsService } from './services';
import { foldersService } from '../folders/services';

export class DocumentsCtrl {

  async getDocument(req: Request, res: Response): Promise<any> {
    const id = Number(req.params['id']);
    const folderId = Number(req.query['folderId']);

    const user = usersService.getCurrentSessionUser(req);

    try {
      const document = await documentsService.getDocument(id, user.id);
      const owner = document.documentsUsers.find((el: DocumentUser) => el.owner);
      const folderPath = await foldersService.getFolderPath(owner.user, folderId);
      const data = await fsPromises.readFile(`${folderPath}/${document.name}.${document.extension}`);

      res.json(data.toString());
    } catch (error) {
      console.log(error)
      res.status(500).send(error.message);
    }
  }

  async saveDocument(req: Request, res: Response): Promise<any> {
    const id = Number(req.params['id']);
    const folderId = Number(req.query['folderId']);
    const text = req.body.text;

    const user = usersService.getCurrentSessionUser(req);

    try {
      const document = await documentsService.getDocument(id, user.id);
      const owner = document.documentsUsers.find((el: DocumentUser) => el.owner);
      const folderPath = await foldersService.getFolderPath(owner.user, folderId);
      const data = await fsPromises.writeFile(`${folderPath}/${document.name}.${document.extension}`, text);

      res.json({ id });
    } catch (error) {
      console.log(error)
      res.status(500).send(error.message);
    }
  }

  async getDocuments(req: Request, res: Response): Promise<any> {
    const owner = Boolean(req.query['owner']);
    const favorites = Boolean(req.query['favorites']);
    const folderId = Number(req.query['folderId']);

    const user = usersService.getCurrentSessionUser(req);

    let documentCondition: any = { root: true };
    let documentFavoriteCondition: any = { userId: user.id };
    let documentUserCondition: any = { '$documentsUsers.userId$': user.id };

    if (!isNaN(folderId)) {
      documentCondition = { folderId };
    }

    if (owner) {
      documentUserCondition['$documentsUsers.owner$'] = true
    }

    if (!favorites && !folderId && !owner) {
      documentUserCondition['$documentsUsers.owner$'] = { [Op.or]: [false, null] };
    }

    if (favorites) {
      documentCondition = {};
    }

    try {
      const documents = await Document.findAll({
        where: { ...documentCondition, ...documentUserCondition },
        include: [
          {
            model: DocumentUser,
            as: 'documentsUsers',
          },
          {
            model: DocumentFavorite,
            as: 'favoritesDocuments',
            where: documentFavoriteCondition,
            separate: favorites ? false : true
          }
        ]
      });

      const documentsMap = await documentsMapService.getDocumentsMap(documents, user.id);

      res.send(documentsMap);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  async createDocument(req: Request, res: Response): Promise<any> {
    const user = usersService.getCurrentSessionUser(req);
    const name = req.body.name;
    const root = Boolean(req.body.root);
    const folderId = Number(req.body.folderId);
    const extension = req.body.extension;
    const data = { name, root, folderId: null, extension };

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
      const document = await documentsService.createDocument(data.name, data.root, data.folderId, data.extension, user);

      res.send(document);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  async updateDocument(req: Request, res: Response): Promise<any> {
    const user = usersService.getCurrentSessionUser(req);
    const id = Number(req.params['id']);
    const name = req.body.name;

    if (!name) {
      return res.status(412).send('Document name is required');
    }

    try {
      await Document.update({ name }, { where: { id, userId: user.id } });

      res.json({ id });
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  async deleteDocument(req: Request, res: Response): Promise<any> {
    const user = usersService.getCurrentSessionUser(req);
    const id = Number(req.params['id']);
    const parent = Number(req.query['parent']);

    try {
      documentsService.deleteDocument(id, parent, user);

      res.json({ id });
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  async setDocumentFavorite(req: Request, res: Response): Promise<any> {
    const user = usersService.getCurrentSessionUser(req);
    const id = Number(req.params['id']);

    try {
      const documentFavorite = await DocumentFavorite.findOne({ where: { userId: user.id, documentId: id } });

      if (documentFavorite) {
        return res.status(400).send('Document is already favorited');
      }

      await DocumentFavorite.create({ userId: user.id, documentId: id });

      res.json({ id });
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  async deleteDocumentFavorite(req: Request, res: Response): Promise<any> {
    const user = usersService.getCurrentSessionUser(req);
    const id = Number(req.params['id']);

    try {
      await DocumentFavorite.destroy({ where: { userId: user.id, documentId: id } });

      res.json({ id });
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  async shareDocument(req: Request, res: Response): Promise<any> {
    const id = Number(req.params['id']);
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
    const user = usersService.getCurrentSessionUser(req);
    const parent = Number(req.query['parent']);
    const file = req['files'].thumbnail;

    try {
      const folder = await documentsService.saveDocument(file.data, file.name, parent, user);

      res.json(folder)
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  async downloadDocument(req: Request, res: Response): Promise<any> {
    const user = usersService.getCurrentSessionUser(req);
    const parent = Number(req.query['parent']);
    const id = Number(req.params['id']);

    try {
      const folderPath = await foldersService.getFolderPath(user, parent);
      const document = await documentsService.getDocument(id, user.id);

      if (!document.shared.includes(user.id) && !document.owner) {
        return res.status(403).send('Not permitted to download');
      }

      const rs = fs.createReadStream(`${folderPath}/${document.name}.${document.extension}`);

      res.setHeader("Content-Disposition", "attachment;");
      res.set('Content-Type', mime.lookup(document.extension));

      rs.pipe(res);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

}

export const documentsCtrl = new DocumentsCtrl();
