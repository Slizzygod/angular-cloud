import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot } from '@angular/router';

import { AppState } from '@app/core/core.state';
import { Store, select } from '@ngrx/store';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { getAuthenticatedUser } from '../stores';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class PermsGuardService implements CanActivate {
  constructor(
    private store: Store<AppState>,
    private userService: UserService
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    return this.store.pipe(
      select(getAuthenticatedUser),
      map((user) => {
        const permissions = route.data['permissions'] as Array<string>;

        return this.userService.permissionGranted({ user, permissions });
      })
    );
  }
}
