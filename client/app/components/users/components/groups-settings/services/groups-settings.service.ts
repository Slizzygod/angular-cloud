import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { Group } from '@app/core/models';

@Injectable({
  providedIn: 'root'
})
export class GroupsSettingsService {

  constructor(
    private http: HttpClient
  ) { }

  createGroup(group: Group): Observable<any> {
    return this.http.post('/api/groups', group);
  }

  updateGroup(group: Group): Observable<any> {
    return this.http.put(`/api/groups/${group.id}`, group);
  }

  deleteGroup(id: number): Observable<any> {
    return this.http.delete(`/api/groups/${id}`);
  }

}
