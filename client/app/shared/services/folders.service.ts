import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { Folder } from '@app/core/models';

@Injectable({
  providedIn: 'root',
})
export class FoldersService {
  constructor(private http: HttpClient) {}

  getFolders(data: FolderOptions = {}): Observable<any> {
    const { parentId, favorites, owner } = data;

    const params: any = {};

    if (parentId) {
      params.parentId = parentId;
    }

    if (favorites) {
      params.favorites = favorites;
    }

    if (owner) {
      params.owner = owner;
    }

    return this.http.get('/api/folders', { params });
  }

  getNestedFolders(id: number): Observable<any> {
    return this.http.get(`/api/folders/${id}/nested`);
  }

  createFolder(folder: Folder): Observable<any> {
    return this.http.post('/api/folders', folder);
  }

  updateFolder(folder: Folder): Observable<any> {
    return this.http.put(`/api/folders/${folder.id}`, folder);
  }

  deleteFolder(id: number): Observable<any> {
    return this.http.delete(`/api/folders/${id}`);
  }

  setFolderFavorite(id: number): Observable<any> {
    return this.http.post(`/api/folders/${id}/favorite`, {});
  }

  shareFolder(id: number, users: number[]): Observable<any> {
    return this.http.post(`/api/folders/${id}/share`, { users });
  }

  downloadFolder(id: number): Observable<any> {
    return this.http.get(`/api/folders/${id}/download`, { responseType: 'blob' });
  }

  moveFolder(id: number, destFolderId: number): Observable<any> {
    return this.http.post(`/api/folders/${id}/move`, { destFolderId });
  }

}

export interface FolderOptions {
  parentId?: number;
  favorites?: boolean;
  owner?: boolean;
}
