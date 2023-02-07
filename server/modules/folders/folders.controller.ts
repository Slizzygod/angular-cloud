import { logsService } from '../logs/logs.service';
import { Request, Response } from 'express';
import { Folder, FolderFavorite, FolderUser } from '../../core/models';

import { usersService } from '../users/users.service';
import { foldersMapService, foldersService } from './services';
import { Op } from 'sequelize';

export class FoldersCtrl {
  async getFolders(req: Request, res: Response): Promise<any> {
    const parentId = Number(req.query['parentId']);
    const favorites = Boolean(req.query['favorites']);
    const owner = Boolean(req.query['owner']);

    const user = usersService.getCurrentSessionUser(req);

    let folderCondition: any = { root: true };
    let folderFavoriteCondition: any = { userId: user.id };
    let folderUserCondition: any = { '$foldersUsers.userId$': user.id };

    if (!isNaN(parentId)) {
      folderCondition = { parentId };
    }

    if (owner) {
      folderUserCondition['$foldersUsers.owner$'] = true;
    }

    if (!favorites && !parentId && !owner) {
      folderUserCondition['$foldersUsers.owner$'] = { [Op.or]: [false, null] };
    }

    if (favorites) {
      folderCondition = {};
    }

    try {
      const folders = await Folder.findAll({
        where: { ...folderCondition, ...folderUserCondition },
        include: [
          {
            model: FolderUser,
            as: 'foldersUsers',
          },
          {
            model: FolderFavorite,
            as: 'favoritesFolders',
            where: folderFavoriteCondition,
            separate: favorites ? false : true
          }
        ]
      });

      const foldersMap = await foldersMapService.getFoldersMap(folders, user.id);

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
      const data = await foldersService.createFolder({ ...folderData, user });
      await FolderUser.create({ userId: user.id, folderId: data.id });

      const folder = await foldersService.getFolder(data.id, user.id);

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

    try {
      await foldersService.deleteFolder({ id, user });

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

  async shareFolder(req: Request, res: Response): Promise<any> {
    const id = Number(req.params['id']);
    const users = req.body.users || [];

    try {
      await FolderUser.destroy({ where: { folderId: id, owner: false } });

      if (users.length > 0) {
        await FolderUser.bulkCreate(users.map((el: number) => ({ userId: el, folderId: id, owner: false })));
      }

      res.json({ id });
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
}

export const foldersCtrl = new FoldersCtrl();
