import { Folder } from "../../../core/models";

class FoldersMapService {

  getFoldersMap(folders: Folder[]): any[] {
    let foldersMap = [];

    if (Array.isArray(folders) && folders.length > 0) {
      foldersMap = folders.map((folder: Folder) => this.getFolderMap(folder));
    }

    return foldersMap;
  }

  getFolderMap(folder: Folder): any {
    return {
      id: folder.id,
      name: folder.name,
      owner: folder.foldersUsers[0].owner,
      favorite: !!folder.favoritesFolders[0],
      parentId: folder.parentId,
      root: folder.root,
      createdAt: folder.createdAt,
      updatedAt: folder.updatedAt
    };
  }

}

export const foldersMapService = new FoldersMapService();
