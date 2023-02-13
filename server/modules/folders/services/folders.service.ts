import * as fsPromises from 'fs/promises';
import * as fs from 'fs';
import * as fsFinder from 'fs-finder';

import { config } from '../../../core/config/config';

import { logsService } from '../../logs/logs.service';
import { Folder, FolderUser, User } from './../../../core/models';
import { foldersMapService } from './folders-map.service';

class FoldersService {

  async getFolderPath(user: User, folderId?: number): Promise<string> {
    let folderPath = `${config.rootDir}/${user.username}`;

    if (folderId) {
      const folderUser = await FolderUser.findOne({
        where: { folderId, owner: true },
        include: [
          {
            model: Folder,
            as: 'folder',
            attributes: ['name', 'id']
          },
          {
            model: User,
            as: 'user',
            attributes: ['username']
          }
        ]
      });

      folderPath = fsFinder
        .from(`${config.rootDir}/${folderUser.user.username}`)
        .findDirectories(`${folderUser.folder.name}_${folderUser.folder.id}`)[0];
    }

    return folderPath;
  }

  async getFolder(id: number, userId: number): Promise<any> {
    const folder = await Folder.findOne({
      where: { id },
      include: [
        {
          model: FolderUser,
          as: 'foldersUsers',
          separate: true
        }
      ]
    });

    const folderMap = await foldersMapService.getFolderMap(folder, userId);

    return folderMap;
  }

  async createFolder(data: ActionsFolderOptions): Promise<Folder> {
    const { name, root, parentId, user, group } = data;

    const folder = await Folder.create({ name, root, parentId: parentId || null, group: group || null });
    const folderDir = await this.getFolderPath(user, parentId);

    await fsPromises.mkdir(`${folderDir}/${name}_${folder.id}`);

    await logsService.createLog({
      alias: 'createFolder',
      method: 'POST',
      data: { name, root },
      user,
      folder,
    });

    return folder;
  }

  async updateFolder(data: ActionsFolderOptions): Promise<number> {
    const { id, name, user, group } = data;

    let condition: any = { id };

    if (!id && group) {
      condition = { group };
    }

    const [ oldFolder, result ] = await Promise.all([
      await Folder.findOne({ where: condition }),
      await Folder.update({ name }, { where: condition, returning: true })
    ]);

    const folderDir = fs.existsSync(`${config.rootDir}/${name}`);

    if (!folderDir) {
      await fsPromises.rename(
        `${config.rootDir}/${user.username}/${oldFolder.name}_${oldFolder.id}`,
        `${config.rootDir}/${user.username}/${name}_${oldFolder.id}`
      );
    }

    await logsService.createLog({
      alias: 'updateFolder',
      method: 'PUT',
      data: { name },
      user,
      folder: result[1][0],
    });

    return result[1][0].id;
  }

  async deleteFolder(data: ActionsFolderOptions): Promise<any> {
    const { id, user, group } = data;

    let condition: any = { id };

    if (!id && group) {
      condition = { group };
    }

    const folder = await Folder.findOne({ where: { id: id || group } });
    const folderPath = await this.getFolderPath(user, folder.id);

    await Promise.all([
      Folder.destroy({ where: condition }),
      logsService.createLog({
        alias: 'deleteFolder',
        method: 'DELETE',
        user,
        folder,
      }),
      fsPromises.rmdir(folderPath, { recursive: true }),
    ]);
  }

  async createRootFolders(): Promise<any> {
    const rootFolder = fs.existsSync(config.rootDir);

    if (!rootFolder) {
      await fsPromises.mkdir(config.rootDir);
      const users = await User.findAll();

      for (const user of users) {
        await fsPromises.mkdir(`${config.rootDir}/${user.username}`);
      }
    }
  }

  async createUserFolder(user: User): Promise<any> {
    const userFolder = fs.existsSync(`${config.rootDir}/${user.username}`);

    if (!userFolder) {
      await fsPromises.mkdir(`${config.rootDir}/${user.username}`);
    }
  }

}

interface ActionsFolderOptions {
  id?: number
  user?: User;
  name?: string;
  root?: boolean;
  parentId?: number;
  group?: number;
}

export const foldersService = new FoldersService();
