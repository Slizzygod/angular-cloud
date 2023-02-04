import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { User } from '@app/core/models';

@Injectable({
  providedIn: 'root'
})
export class UsersSettingsService {

  constructor(
    private http: HttpClient
  ) { }

  updateUser(user: User): Observable<any> {
    return this.http.put(`/api/users/${user.id}/update`, user);
  }

  blockUser(id: number): Observable<any> {
    return this.http.post(`/api/users/${id}/block`, {});
  }

  unlockUser(id: number): Observable<any> {
    return this.http.post(`/api/users/${id}/unlock`, {});
  }

}
