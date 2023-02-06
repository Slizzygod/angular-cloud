import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { Document } from '@app/core/models';

@Injectable({
  providedIn: 'root',
})
export class DocumentsService {

  constructor(private http: HttpClient) {}

  getDocuments(data: DocumentOptions = {}): Observable<any> {
    const { folderId, favorites, owner } = data;

    const params: any = {};

    if (folderId) {
      params.folderId = folderId;
    }

    if (favorites) {
      params.favorites = favorites;
    }

    if (owner) {
      params.owner = owner;
    }

    return this.http.get('/api/documents', { params });
  }

  createDocument(document: Document): Observable<any> {
    return this.http.post('/api/documents', document);
  }

  updateDocument(document: Document): Observable<any> {
    return this.http.put(`/api/documents/${document.id}`, document);
  }

  deleteDocument(id: number): Observable<any> {
    return this.http.delete(`/api/documents/${id}`);
  }

  setDocumentFavorite(id: number): Observable<any> {
    return this.http.post(`/api/documents/${id}/favorite`, {});
  }

  deleteDocumentFavorite(id: number): Observable<any> {
    return this.http.delete(`/api/documents/${id}/favorite`);
  }

  shareDocument(id: number, users: number[]): Observable<any> {
    return this.http.post(`/api/documents/${id}/share`, { users });
  }

}

export interface DocumentOptions {
  folderId?: number;
  favorites?: boolean;
  owner?: boolean;
}
