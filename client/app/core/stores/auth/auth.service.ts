import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

import { UserService, LocalStorageService } from '../../services';
import { User } from '../../models';
import { switchMap } from 'rxjs/operators';
import { iif, defer, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  redirectUrl: any = null;

  constructor(
    private userService: UserService,
    private jwtHelper: JwtHelperService,
    private storage: LocalStorageService
  ) {}

  login(params: any) {
    return this.userService.authenticate(params).pipe(
      switchMap((res: any) => iif(() =>
        res.user,
        defer(() => of(res)),
        defer(() => of(this.setCurrentUser(res))),
      ))
    );
  }

  updateToken(token: any) {
    this.storage.setItem('TOKEN', token);
  }

  decodeUserFromToken(token: string): any {
    return this.jwtHelper.decodeToken(token);
  }

  setCurrentUser(res: any) {
    const currentUser: User = {
      id: null,
      username: null,
      exp: null,
      permissions: []
    };

    const token = res && res.token ? res.token : '';
    this.updateToken(token);
    const authData = this.decodeUserFromToken(token);

    if (authData) {
      currentUser.id = authData.id;
      currentUser.username = authData.username;
      currentUser.email = authData.email;
      currentUser.firstName = authData.firstName;
      currentUser.lastName = authData.lastName;
      currentUser.exp = authData.exp;
      currentUser.permissions = authData.permissions;
    }

    return currentUser;
  }

  setUserImage(data: any) {
    let field = { base64: '', mime: '' };
    if (data && data.length > 0) {
      try {
        return field = JSON.parse(data);
      } catch (_error) {
        return field;
      }
    }
    return field;
  }

}
