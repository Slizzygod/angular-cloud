import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { Document } from '@app/core/models';

@Injectable({
  providedIn: 'root',
})
export class DocumentsService {

  constructor(private http: HttpClient) {}

  getDocument(id: number, parent: number): Observable<any> {
    const params: any = {};

    if (parent) {
      params.parent = parent
    }

    return this.http.get(`/api/documents/${id}`, { params });
  }

  saveDocument(id: number, parent: number, text: string): Observable<any> {
    const params: any = {};

    if (parent) {
      params.parent = parent
    }

    return this.http.post(`/api/documents/${id}`, { text }, { params });
  }

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

  deleteDocument(id: number, parent: number): Observable<any> {
    const params: any = {};

    if (parent) {
      params.parent = parent
    }

    return this.http.delete(`/api/documents/${id}`, { params });
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

  uploadDocument(document: FormData, parent: number): Observable<any> {
    const params: any = {};

    if (parent) {
      params.parent = parent
    }

    return this.http.post(`/api/documents/upload`, document, { params });
  }

  downloadDocument(id: number, parent: number): Observable<any> {
    const params: any = {};

    if (parent) {
      params.parent = parent
    }

    return this.http.get(`/api/documents/${id}/download`, { params, responseType: 'blob' });
  }

}

export interface DocumentOptions {
  folderId?: number;
  favorites?: boolean;
  owner?: boolean;
}
