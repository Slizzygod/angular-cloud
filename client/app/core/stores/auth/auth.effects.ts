import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Actions, ofType, createEffect } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';

import { getAuthenticatedUser } from './auth.selectors';
import { of, forkJoin, iif } from 'rxjs';
import { tap, map, catchError, withLatestFrom, mergeMap } from 'rxjs/operators';

import { LocalStorageService, NotificationService } from '@app/core/services';
import { AuthService } from './auth.service';

import {
  ActionAuthLogin,
  ActionAuthLogout,
  ActionAuthLoginError,
  ActionAuthLoginSuccess,
  AuthActionTypes,
  ActionChangeAuthenticateUser,
  ActionAuthRequiredConfirm,
  ActionAuthConfirm,
} from './auth.actions';

export const AUTH_KEY = 'AUTH';

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions<Action>,
    private localStorageService: LocalStorageService,
    private authService: AuthService,
    private router: Router,
    private store: Store,
    private notificationsService: NotificationService
  ) {}

  login$ = createEffect(() => {
    return this.actions$.pipe(
      ofType<ActionAuthLogin>(AuthActionTypes.LOGIN),
      mergeMap((action: ActionAuthLogin) =>
        this.authService.login(action.payload).pipe(
          mergeMap((data: any) =>
            iif(
              () => data && data.user,
              of(new ActionAuthRequiredConfirm({ data })),
              of(new ActionAuthLoginSuccess({ user: data }))
            )
          ),
          catchError((error: unknown) =>
            of(new ActionAuthLoginError({ error }))
          )
        )
      )
    );
  });

  confirm$ = createEffect(() => {
    return this.actions$.pipe(
      ofType<ActionAuthConfirm>(AuthActionTypes.AUTHENTICATE_CONFIRM),
      mergeMap((action: ActionAuthConfirm) =>
        this.authService.login(action.payload).pipe(
          mergeMap((data: any) =>
            iif(
              () => data,
              of(new ActionAuthLoginError({ error: new Error() })),
              of(new ActionAuthLoginSuccess({ user: data }))
            )
          ),
          catchError((error: unknown) =>
            of(new ActionAuthLoginError({ error }))
          )
        )
      )
    );
  });

  authenticationSuccess$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType<ActionAuthLoginSuccess>(AuthActionTypes.AUTHENTICATE_SUCCESS),
        map((action: ActionAuthLoginSuccess) => action.payload),
        tap((payload: any) => {
          this.localStorageService.setItem(
            AUTH_KEY,
            JSON.stringify({ isAuthenticated: true, user: payload.user })
          );
          this.notificationsService.success(
            `Добро пожаловать, ${payload.user.username}`,
            4000
          );

          if (this.authService.redirectUrl) {
            this.router.navigateByUrl(this.authService.redirectUrl);
          } else {
            this.router.navigate(['/']);
          }
        })
      );
    },
    { dispatch: false }
  );

  authenticationError$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType<ActionAuthLoginError>(AuthActionTypes.AUTHENTICATE_ERROR),
        map((action: ActionAuthLoginError) => {
          let res = { error: 'Неизвестная ошибка' };

          if (action && action.payload && action.payload.error) {
            res = action.payload.error;

            if (action.payload.error.status === 403) {
              res = { error: 'Нет доступа' };
            }
          }
          this.notificationsService.success(`Произошла ошибка`, 4000);
          throw res;
        })
      );
    },
    { dispatch: false }
  );

  logout$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType<ActionAuthLogout>(AuthActionTypes.LOGOUT),
        map(() => {
          this.localStorageService.removeItem('TOKEN');
          this.localStorageService.setItem(
            AUTH_KEY,
            JSON.stringify({ isAuthenticated: false, isTwoStepEnabled: false })
          );

          this.router.navigate(['/login']);
        })
      );
    },
    { dispatch: false }
  );
}
