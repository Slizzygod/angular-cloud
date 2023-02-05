import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { Folder } from '@app/core/models';

@Injectable({
  providedIn: 'root'
})
export class FoldersService {

  constructor(
    private http: HttpClient
  ) { }

  getFolders({ parentId, favorites }: { parentId: number, favorites?: boolean }): Observable<any> {
    return this.http.get('/api/folders', { params: { parentId, favorites } });
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

  deleteFolderFavorite(id: number): Observable<any> {
    return this.http.delete(`/api/folders/${id}/favorite`);
  }

}
