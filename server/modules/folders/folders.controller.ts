import { Op } from 'sequelize';
import { logsService } from '../logs/logs.service';
import { Request, Response } from 'express';
import { Folder, FolderFavorite, FolderUser } from '../../core/models';

import { usersService } from '../users/users.service';
import { foldersMapService, foldersService } from './services';

export class FoldersCtrl {
  async getFolders(req: Request, res: Response): Promise<any> {
    const parentId = Number(req.query['parentId']);
    const favorites = Boolean(req.query['favorites']);
    const owner = Boolean(req.query['owner']);

    const user = usersService.getCurrentSessionUser(req);

    let folderCondition: any = { root: true };
    let folderFavoriteCondition: any = { userId: user.id };
    let folderUserCondition: any = { userId: user.id, owner: { [Op.or]: [false, null] } };

    if (!isNaN(parentId)) {
      folderCondition = { parentId };
    }

    if (favorites) {
      folderCondition = {};
      folderUserCondition = { userId: user.id }
    }

    if (owner) {
      folderUserCondition.owner = true
    }

    try {
      const folders = await Folder.findAll({
        where: folderCondition,
        include: [
          {
            model: FolderUser,
            as: 'foldersUsers',
            where: folderUserCondition,
          },
          {
            model: FolderFavorite,
            as: 'favoritesFolders',
            where: folderFavoriteCondition,
            separate: favorites ? false : true
          }
        ]
      });

      const foldersMap = foldersMapService.getFoldersMap(folders);

      res.send(foldersMap);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  async createFolder(req: Request, res: Response): Promise<any> {
    const user = usersService.getCurrentSessionUser(req);
    const name = req.body.name;
    const root = Boolean(req.body.root);
    const parentId = Number(req.body.parentId);
    const folderData = { name, root, parentId: null };

    if (!name) {
      return res.status(412).send('Folder name is required');
    }

    if (!isNaN(parentId)) {
      folderData.parentId = parentId;
    }

    try {
      const folder = await foldersService.createFolder({ ...folderData, user });

      await FolderUser.create({ userId: user.id, folderId: folder.id });

      res.send(folder);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  async updateFolder(req: Request, res: Response): Promise<any> {
    const user = usersService.getCurrentSessionUser(req);
    const id = Number(req.params['id']);
    const name = req.body.name;

    if (!name) {
      return res.status(412).send('Folder name is required');
    }

    try {
      await foldersService.updateFolder({ id, name, user });

      res.json({ id });
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  async deleteFolder(req: Request, res: Response): Promise<any> {
    const user = usersService.getCurrentSessionUser(req);
    const id = Number(req.params['id']);

    const folder = await Folder.findOne({ where: { id } });

    try {
      await Promise.all([
        Folder.destroy({ where: { id } }),
        logsService.createLog({
          alias: 'deleteFolder',
          method: 'DELETE',
          user,
          folder,
        }),
      ]);

      res.json({ id });
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  async setFolderFavorite(req: Request, res: Response): Promise<any> {
    const user = usersService.getCurrentSessionUser(req);
    const id = req.params['id'];

    try {
      const folderFavorite = await FolderFavorite.findOne({ where: { userId: user.id, folderId: id } });

      if (folderFavorite) {
        return res.status(400).send('Folder is already favorited');
      }

      await FolderFavorite.create({ userId: user.id, folderId: id });

      res.json({ id });
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  async deleteFolderFavorite(req: Request, res: Response): Promise<any> {
    const user = usersService.getCurrentSessionUser(req);
    const id = req.params['id'];

    try {
      await FolderFavorite.destroy({ where: { userId: user.id, folderId: id } });

      res.json({ id });
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
}

export const foldersCtrl = new FoldersCtrl();
