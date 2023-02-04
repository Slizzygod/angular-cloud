import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { Settings } from '@app/core/models';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor(
    private http: HttpClient
  ) { }

  getUserSettings(): Observable<any> {
    return this.http.get('/api/users/settings');
  }

  updateUserSettings(settings: Settings): Observable<any> {
    return this.http.post('/api/users/settings', settings);
  }

}
