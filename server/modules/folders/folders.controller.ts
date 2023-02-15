import * as archiver from 'archiver';
import * as fsPromises from 'fs/promises';

import { Request, Response } from 'express';
import { Folder, FolderUser } from '../../core/models';

import { usersService } from '../users/users.service';
import { foldersMapService, foldersService } from './services';

export class FoldersCtrl {

  async getFolders(req: Request, res: Response): Promise<any> {
    const parentId = Number(req.query.parentId);
    const favorites = Boolean(req.query.favorites);
    const joint = Boolean(req.query.joint);
    const owner = Boolean(req.query.owner);

    const user = usersService.getCurrentSessionUser(req);

    try {
      const folders = await foldersService.getFolders({ owner, favorites, joint, parentId, user })
      const foldersMap = await foldersMapService.getFoldersMap(folders, user.id);

      res.send(foldersMap);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  async getNestedFolders(req: Request, res: Response): Promise<any> {
    const id = Number(req.params.id);
    const nestedFolders = [];

    const user = usersService.getCurrentSessionUser(req);

    try {
      await foldersService.getNestedFolders(id, nestedFolders);

      const index = nestedFolders.findIndex((el: Folder) => el.foldersUsers.find((el: FolderUser) => el.userId === user.id));

      if (index === -1) {
        return res.status(403).send('Permissions denied');
      }

      res.send(nestedFolders.splice(index));
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  async createFolder(req: Request, res: Response): Promise<any> {
    const name = req.body.name;
    const root = Boolean(req.body.root);
    const parentId = req.body.parentId;

    const user = usersService.getCurrentSessionUser(req);

    if (!name) {
      return res.status(412).send('Folder name is required');
    }

    try {
      const data = await foldersService.createFolder({ name, root, parentId, user });
      const folder = await foldersService.getFolder(data.id, user.id);

      res.send(folder);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  async updateFolder(req: Request, res: Response): Promise<any> {
    const id = Number(req.params.id);
    const name = req.body.name;

    const user = usersService.getCurrentSessionUser(req);

    if (!name) {
      return res.status(412).send('Folder name is required');
    }

    try {
      const folders = await Folder.findAll({ where: { name } });

      if (folders.length > 0) {
        return res.status(400).send('Name must be unique');
      }

      await foldersService.updateFolder({ id, name, user });

      res.json({ id });
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  async deleteFolder(req: Request, res: Response): Promise<any> {
    const id = Number(req.params.id);

    const user = usersService.getCurrentSessionUser(req);

    try {
      await foldersService.deleteFolder({ id, user });

      res.json({ id });
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  async setFolderFavorite(req: Request, res: Response): Promise<any> {
    const id = req.params.id;

    const user = usersService.getCurrentSessionUser(req);

    try {
      const folder = await FolderUser.findOne({ where: { userId: user.id, folderId: id } });

      if (!folder) {
        return res.status(400).send('Folder is not defined');
      }

      await folder.update({ favorite: !Boolean(folder.favorite) });

      res.json({ id });
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  async shareFolder(req: Request, res: Response): Promise<any> {
    const id = Number(req.params.id);
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

  async downloadFolder(req: Request, res: Response): Promise<any> {
    const id = Number(req.params.id);

    try {
      const folderPath = await foldersService.getFolderPath(id);
      const folderFiles = await foldersService.getFolderFiles(folderPath, []);

      let totalSize = 0

      for (const file of folderFiles) {
        const statistic = await fsPromises.stat(file);

        totalSize += statistic.size;
      }

      const archive = archiver('zip').directory(folderPath, false);

      res.setHeader("Content-Disposition", "attachment;");
      res.set('Length', String(totalSize));
      res.set('Content-Type', 'application/zip');
      archive.pipe(res);
      archive.finalize();
    } catch (error) {
      console.log(error);
      res.status(500).send(error.message);
    }
  }

  async moveFolder(req: Request, res: Response): Promise<any> {
    const id = Number(req.params.id);
    const destFolderId = Number(req.body.destFolderId);

    if (isNaN(destFolderId)) {
      return res.status(412).send('Destination folder id required');
    }

    try {
      await foldersService.moveFolder(id, destFolderId);

      res.json({ id });
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
}

export const foldersCtrl = new FoldersCtrl();
