import { Request, Response } from 'express';
import { Op } from 'sequelize';

import { Document, DocumentFavorite, DocumentUser } from '../../core/models';
import { logsService } from '../logs/logs.service';
import { usersService } from '../users/users.service';
import { documentsMapService, documentsService } from './services';

export class DocumentsCtrl {

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
      const data = await Document.create({ ...documentData, userId: user.id });
      await DocumentUser.create({ userId: user.id, documentId: data.id });

      const document = await documentsService.getDocument(data.id, user.id)

      await logsService.createLog({
        alias: 'createDocument',
        method: 'POST',
        data: { name, root, folderId },
        user,
        document,
      });

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

}

export const documentsCtrl = new DocumentsCtrl();
