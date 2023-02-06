import { Request, Response } from 'express';
import { Op } from 'sequelize';

import { Document, DocumentFavorite, DocumentUser } from '../../core/models';
import { logsService } from '../logs/logs.service';
import { usersService } from '../users/users.service';
import { documentsMapService } from './services';

export class DocumentsCtrl {

  async getDocuments(req: Request, res: Response): Promise<any> {
    const owner = Boolean(req.query['owner']);
    const favorites = Boolean(req.query['favorites']);
    const folderId = Number(req.query['folderId']);

    const user = usersService.getCurrentSessionUser(req);

    let documentCondition: any = { root: true };
    let documentUserCondition: any = { userId: user.id, owner: { [Op.or]: [false, null] } };
    let documentFavoriteCondition: any = { userId: user.id };

    if (!isNaN(folderId)) {
      documentCondition = { folderId };
    }

    if (owner) {
      documentUserCondition.owner = true
    }

    if (favorites) {
      documentCondition = {};
      documentUserCondition = { userId: user.id };
    }

    try {
      const documents = await Document.findAll({
        where: documentCondition,
        include: [
          {
            model: DocumentUser,
            as: 'documentsUsers',
            where: documentUserCondition,
          },
          {
            model: DocumentFavorite,
            as: 'favoritesDocuments',
            where: documentFavoriteCondition,
            separate: favorites ? false : true
          }
        ]
      });

      const documentsMap = documentsMapService.getDocumentsMap(documents);

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
    const documentData = { name, root, folderId: null, extension };

    if (!name) {
      return res.status(412).send('Folder name is required');
    }

    if (!extension) {
      return res.status(412).send('Folder extension is required');
    }

    if (!isNaN(folderId)) {
      documentData.folderId = folderId;
    }

    try {
      const document = await Document.create({ ...documentData, userId: user.id });

      await Promise.all([
        DocumentUser.create({ userId: user.id, documentId: document.id }),
        logsService.createLog({
          alias: 'createDocument',
          method: 'POST',
          data: { name, root, folderId },
          user,
          document,
        })
      ]);

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

    const document = await Document.findOne({ where: { id } });

    try {
      await Promise.all([
        Document.destroy({ where: { id } }),
        logsService.createLog({
          alias: 'deleteDocument',
          method: 'DELETE',
          user,
          document,
        }),
      ]);

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

}

export const documentsCtrl = new DocumentsCtrl();
