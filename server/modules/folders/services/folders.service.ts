import * as fsPromises from 'fs/promises';
import * as fs from 'fs';
import * as fsFinder from 'fs-finder';

import { Op } from 'sequelize';

import { config } from '../../../core/config/config';

import { Folder, FoldersOptions, FolderUser, User } from './../../../core/models';

import { logsService } from '../../logs/logs.service';
import { foldersMapService } from './folders-map.service';

class FoldersService {

  async getFolders(data: FoldersOptions): Promise<any> {
    const { user, parentId, owner, favorites, joint } = data;

    let folderCondition: any = { root: true };
    let folderUserCondition: any = { userId: user.id };

    if (owner) {
      folderUserCondition.owner = true;
    }

    if (!favorites && !parentId && !owner) {
      folderUserCondition.owner = { [Op.or]: [false, null] };
    }

    if (favorites) {
      folderCondition = {};
      folderUserCondition.favorite = true;
    }

    if (joint) {
      folderCondition = {};
    }

    if (!isNaN(parentId)) {
      folderUserCondition = {};
      folderCondition = { parentId };
    }
    console.log(folderUserCondition)
    console.log(folderCondition)
    return await Folder.findAll({
      where: folderCondition,
      include: [
        {
          model: FolderUser,
          as: 'foldersUsers',
          where: folderUserCondition
        }
      ]
    });
  }

  async getNestedFolders(id: number, nested: Folder[]): Promise<any> {
    const folder = await Folder.findOne({
      where: { id },
      attributes: ['name', 'id', 'parentId'],
      include: [
        {
          model: FolderUser,
          as: 'foldersUsers',
        }
      ]
    });

    if (folder) {
      nested.unshift(folder);

      if (folder.parentId) {
        await this.getNestedFolders(folder.parentId, nested);
      }
    }
  }

  async getFolderPath(folderId: number, username?: string): Promise<string> {
    let folderPath = `${config.rootDir}/${username}`

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

  async createFolder(data: FoldersOptions): Promise<Folder> {
    const { name, root, parentId, user, group } = data;

    const folder = await Folder.create({ name, root, parentId, group });
    const folderUsers = await FolderUser.create({ userId: user.id, folderId: folder.id });
    const folderDir = await this.getFolderPath(parentId, user.username);

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

  async updateFolder(data: FoldersOptions): Promise<number> {
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

  async deleteFolder(data: FoldersOptions): Promise<any> {
    const { id, user, group } = data;

    let condition: any = { id };

    if (!id && group) {
      condition = { group };
    }

    const folder = await Folder.findOne({ where: { id: id || group } });
    const folderPath = await this.getFolderPath(folder.id);

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

  async moveFolder(id: number, destFolderId: number): Promise<any> {
    const folder = await Folder.findOne({ where: { id } });
    const folderPath = await this.getFolderPath(id);
    const destFolderPath = await this.getFolderPath(destFolderId);

    await Promise.all([
      fsPromises.rename(folderPath, `${destFolderPath}/${folder.name}_${folder.id}`),
      Folder.update({ root: false, parentId: destFolderId }, { where: { id } })
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

  async getFolderSize(username: string): Promise<any> {
    const files = await this.getFolderFiles(`${config.rootDir}/${username}`, []);

    let totalSize = 0

    for (const file of files) {
      const statistic = await fsPromises.stat(file);

      totalSize += statistic.size;
    }

    return totalSize;
  }

  async getFolderFiles(folderPath: string, arrayOfFiles: string[]): Promise<any> {
    const files = await fsPromises.readdir(folderPath)

    for (const file of files) {
      if (fs.statSync(`${folderPath}/${file}`).isDirectory()) {
        arrayOfFiles = await this.getFolderFiles(`${folderPath}/${file}`, arrayOfFiles)
      } else {
        arrayOfFiles.push(`${folderPath}/${file}`)
      }
    }

    return arrayOfFiles;
  }

  async checkFreeSpace(user: User, folderId: number, fileSize: number = 0): Promise<any> {
    let username = user.username;

    if (folderId) {
      const ownerFolder = await FolderUser.findOne({
        where: { folderId, owner: true },
        include: [ { model: User, as: 'user', attributes: ['username'] } ]
      });

      if (!ownerFolder) {
        throw new Error('Folder owner is not defined');
      }

      username = ownerFolder.user.username;
    }

    const needlyUser = await User.findOne({ where: { username }, attributes: ['space'] });
    const folderSize = await this.getFolderSize(username);

    return (folderSize + fileSize) < (needlyUser.space * 1000 * 1000 * 1000);
  }

}

export const foldersService = new FoldersService();
