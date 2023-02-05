import { logService } from './../../shared/services/log.service';
import { Request, Response } from 'express';
import { Folder, FolderUser } from '../../core/models';

import { usersService } from '../users/users.service';

export class FoldersCtrl {
  async getFolders(req: Request, res: Response): Promise<any> {
    const user = usersService.getCurrentSessionUser(req);

    try {
      const data = await FolderUser.findAll({
        where: { userId: user.id, owner: true },
        include: [
          {
            model: Folder,
            as: 'folder',
            where: { root: true },
          },
        ],
        order: [['createdAt', 'ASC']],
      });

      const folders = data.map((el: FolderUser) => el.folder);

      res.send(folders);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  async createFolder(req: Request, res: Response): Promise<any> {
    const user = usersService.getCurrentSessionUser(req);
    const name = req.body.name;
    const root = Boolean(req.body.root);

    if (!name) {
      res.status(412).send('Folder name is required');
    }

    try {
      const folder = await Folder.create({ name, root });

      await Promise.all([
        folder.setUsers([user.id]),
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
      res.status(412).send('Folder name is required');
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
}

export const foldersCtrl = new FoldersCtrl();
