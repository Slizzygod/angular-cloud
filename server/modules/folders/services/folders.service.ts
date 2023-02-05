import { logService } from '../../../shared/services';
import { Folder } from './../../../core/models';

class FoldersService {
  async createFolder(data: ActionsFolderOptions): Promise<Folder> {
    const { name, root, parentId, userId, group } = data;

    const folder = await Folder.create({ name, root, parentId: parentId || null, group: group || null });

    await logService.createLog({
      alias: 'createFolder',
      method: 'POST',
      data: { name, root },
      userId,
      folderId: folder.id,
    });

    return folder;
  }

  async updateFolder(data: ActionsFolderOptions): Promise<number> {
    const { id, name, userId, group } = data;

    let condition: any = { id };

    if (!id && group) {
      condition = { group };
    }

    const result = await Folder.update({ name }, { where: condition, returning: true });

    await logService.createLog({
      alias: 'createFolder',
      method: 'POST',
      data: { name },
      userId,
      folderId: result[1][0].id,
    });

    return result[1][0].id;
  }
}

interface ActionsFolderOptions {
  id?: number
  userId?: number;
  name?: string;
  root?: boolean;
  parentId?: number;
  group?: number;
}

export const foldersService = new FoldersService();
