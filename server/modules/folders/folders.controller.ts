import { logService } from './../../shared/services/log.service';
import { Request, Response } from 'express';
import { Folder, FolderFavorite, FolderUser } from '../../core/models';

import { usersService } from '../users/users.service';
import { foldersMapService } from './services';

export class FoldersCtrl {
  async getFolders(req: Request, res: Response): Promise<any> {
    let condition: any = { root: true };

    const parentId = Number(req.query['parentId']);
    const user = usersService.getCurrentSessionUser(req);

    if (!isNaN(parentId)) {
      condition = { parentId };
    }

    try {
      const folders = await Folder.findAll({
        where: condition,
        include: [
          {
            model: FolderUser,
            as: 'foldersUsers',
            where: { userId: user.id, owner: true },
          },
          {
            model: FolderFavorite,
            as: 'favoritesFolders',
            where: { userId: user.id },
            separate: true
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
      const folder = await Folder.create(folderData);

      await Promise.all([
        FolderUser.create({ userId: user.id, folderId: folder.id }),
        logService.createLog({
          alias: 'createFolder',
          method: 'POST',
          data: { name, root },
          userId: user.id,
          folderId: folder.id,
        }),
      ]);

      res.send(folder);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  async updateFolder(req: Request, res: Response): Promise<any> {
    const user = usersService.getCurrentSessionUser(req);
    const id = req.params['id'];
    const name = req.body.name;

    if (!name) {
      return res.status(412).send('Folder name is required');
    }

    try {
      await Promise.all([
        Folder.update({ name }, { where: { id } }),
        logService.createLog({
          alias: 'createFolder',
          method: 'POST',
          data: { name },
          userId: user.id,
          folderId: id,
        }),
      ]);

      res.json({ id });
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  async deleteFolder(req: Request, res: Response): Promise<any> {
    const user = usersService.getCurrentSessionUser(req);
    const id = req.params['id'];

    try {
      await Promise.all([
        Folder.destroy({ where: { id } }),
        logService.createLog({
          alias: 'createFolder',
          method: 'POST',
          userId: user.id,
          folderId: id,
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
