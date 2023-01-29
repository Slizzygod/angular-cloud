import { Action } from '@ngrx/store';

import { User } from '../../models';

export enum AuthActionTypes {
  LOGIN = '[Auth] Login',
  LOGOUT = '[Auth] Logout',
  AUTHENTICATE_ERROR = '[Auth] Authentication error',
  AUTHENTICATE_SUCCESS = '[Auth] Authentication success',
  CHANGE_AUTHENTICATED_USER = '[Auth] Change authenticated user',
  REQUIRED_CONFIRM = '[Auth] Required confirm',
  AUTHENTICATE_CONFIRM = '[Auth] Authentication confirm',
}

export class ActionAuthLogin implements Action {
  readonly type = AuthActionTypes.LOGIN;

  constructor(
    public payload: {
      username: string;
      password: string;
    }
  ) {}
}

export class ActionAuthLogout implements Action {
  readonly type = AuthActionTypes.LOGOUT;

  constructor(public payload?: any) {}
}

export class ActionAuthLoginError implements Action {
  public type: string = AuthActionTypes.AUTHENTICATE_ERROR;

  constructor(public payload?: any) {}
}

export class ActionAuthLoginSuccess implements Action {
  public type: string = AuthActionTypes.AUTHENTICATE_SUCCESS;

  constructor(public payload: { user: User }) {}
}

export class ActionChangeAuthenticateUser implements Action {
  public type: string = AuthActionTypes.CHANGE_AUTHENTICATED_USER;

  constructor(public payload: { user: any }) {}
}

export class ActionAuthRequiredConfirm implements Action {
  public type: string = AuthActionTypes.REQUIRED_CONFIRM;

  constructor(public payload?: any) {}
}

export class ActionAuthConfirm implements Action {
  readonly type = AuthActionTypes.AUTHENTICATE_CONFIRM;

  constructor(
    public payload: {
      username: string;
      password: string;
    }
  ) {}
}

export type AuthActions =
  | ActionAuthLogin
  | ActionAuthLogout
  | ActionAuthLoginError
  | ActionAuthLoginSuccess
  | ActionChangeAuthenticateUser
  | ActionAuthRequiredConfirm
  | ActionAuthConfirm;
