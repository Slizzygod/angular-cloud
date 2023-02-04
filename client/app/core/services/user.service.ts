import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { User } from '@app/core/models';

import { Store } from '@ngrx/store';
import { getAuthenticatedUser } from '@app/core/stores/auth';
import { PERMISSION_ADMIN } from '@app/shared/constants';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  currentUser$: Observable<User | undefined> =
    this.store.select(getAuthenticatedUser);
  currentUser: any = null;

  constructor(private http: HttpClient, private store: Store) {
    this.currentUser$.subscribe({
      next: (user: User) => this.currentUser = user
    });
  }

  authenticate(params: any): Observable<any> {
    return this.http.post('/api/login', params);
  }

  permissionGranted(options: any): boolean {
    if (!options.user) {
      options.user = this.currentUser;
    }
    if (!options.user || !options.user.permissions) {
      return false;
    }
    if (!options.permissions) {
      return true;
    }
    if (options.user.permissions.includes(PERMISSION_ADMIN)) {
      return true;
    }
    for (const userPerm of options.user.permissions) {
      const basePerm = userPerm.split(':')[0];
      if (options.permissions.includes(basePerm)) {
        return true;
      }
    }
    return false;
  }
}
