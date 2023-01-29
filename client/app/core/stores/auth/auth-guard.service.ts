import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateChild,
} from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { withLatestFrom, map } from 'rxjs/operators';

import { selectIsAuthenticated, getAuthenticatedUser } from './auth.selectors';
import { AppState } from '../../core.state';
import { ActionAuthLogout } from './auth.actions';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuardService implements CanActivate, CanActivateChild {
  constructor(
    private store: Store<AppState>,
    private authService: AuthService
  ) {}

  canActivate(
    _route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    const isAuthenticated$: Observable<any> = this.store.select(
      selectIsAuthenticated
    );

    return isAuthenticated$.pipe(
      withLatestFrom(this.store.select(getAuthenticatedUser)),
      map(([isAuthenticated, user]) => {
        if (
          !isAuthenticated ||
          (user && user.exp && user.exp * 1000 < Date.now())
        ) {
          this.store.dispatch(new ActionAuthLogout());
          this.authService.redirectUrl = state.url;
          return false;
        }
        return true;
      })
    );
  }

  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.canActivate(route, state);
  }
}
