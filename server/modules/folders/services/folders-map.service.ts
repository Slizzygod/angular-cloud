import { Folder, FolderUser } from "../../../core/models";

class FoldersMapService {

  async getFoldersMap(folders: Folder[], userId: number): Promise<any[]> {
    let foldersMap = [];

    if (Array.isArray(folders) && folders.length > 0) {
      const folderUsers = await FolderUser.findAll({ where: { folderId: folders.map((el: Folder) => el.id) } });

      foldersMap = folders.map((folder: Folder) => this.getFolderMap(folder, userId, folderUsers));
    }

    return foldersMap;
  }

  getFolderMap(folder: Folder, userId: number, folderUsers: FolderUser[] = []): any {
    return {
      id: folder.id,
      name: folder.name,
      owner: !!folder.foldersUsers.find((el: FolderUser) => el.userId === userId && el.owner),
      shared: folderUsers.filter((el: FolderUser) => !el.owner && el.folderId === folder.id).map((el: FolderUser) => el.userId),
      favorite: !!folder.favoritesFolders[0],
      parentId: folder.parentId,
      root: folder.root,
      createdAt: folder.createdAt,
      updatedAt: folder.updatedAt
    };
  }

}

export const foldersMapService = new FoldersMapService();
