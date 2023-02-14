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
    const { folderId, favorites, joint, owner } = data;

    const params: any = {};

    if (folderId) {
      params.folderId = folderId;
    }

    if (favorites) {
      params.favorites = favorites;
    }

    if (joint) {
      params.joint = joint;
    }

    if (owner) {
      params.owner = owner;
    }

    return this.http.get('/api/documents', { params });
  }

  getDocument(id: number): Observable<any> {
    return this.http.get(`/api/documents/${id}`);
  }

  saveDocument(id: number, text: string): Observable<any> {
    return this.http.post(`/api/documents/${id}`, { text });
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

  shareDocument(id: number, users: number[]): Observable<any> {
    return this.http.post(`/api/documents/${id}/share`, { users });
  }

  uploadDocument(document: FormData, folderId: number): Observable<any> {
    const params: any = {};

    if (folderId) {
      params.folderId = folderId;
    }

    return this.http.post(`/api/documents/upload`, document, { params, reportProgress: true, observe: 'events' });
  }

  downloadDocument(id: number): Observable<any> {
    return this.http.get(`/api/documents/${id}/download`, { responseType: 'blob' });
  }

  moveDocument(id: number, destFolderId: number): Observable<any> {
    return this.http.post(`/api/documents/${id}/move`, { destFolderId });
  }

}

export interface DocumentOptions {
  folderId?: number;
  favorites?: boolean;
  joint?: boolean;
  owner?: boolean;
}
