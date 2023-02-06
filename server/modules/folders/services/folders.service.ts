import { logsService } from '../../logs/logs.service';
import { Folder, User } from './../../../core/models';

class FoldersService {
  async createFolder(data: ActionsFolderOptions): Promise<Folder> {
    const { name, root, parentId, user, group } = data;

    const folder = await Folder.create({ name, root, parentId: parentId || null, group: group || null });

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

    const result = await Folder.update({ name }, { where: condition, returning: true });

    await logsService.createLog({
      alias: 'updateFolder',
      method: 'PUT',
      data: { name },
      user,
      folder: result[1][0],
    });

    return result[1][0].id;
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
