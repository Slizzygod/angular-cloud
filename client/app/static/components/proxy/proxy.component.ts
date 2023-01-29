import { PERMISSION_ADMIN } from './../../../shared/constants/permissions';
import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { User } from '@app/core/models';
import { select, Store } from '@ngrx/store';
import { getAuthenticatedUser } from '@app/core/stores/auth';

import { UserService } from '@app/core/services';
import { PERMISSION_USER } from '@app/shared/constants/permissions';

@Component({
  selector: 'app-proxy',
  templateUrl: './proxy.component.html',
  styleUrls: ['./proxy.component.scss']
})
export class ProxyComponent implements OnDestroy {
  private subscriptions = new Subscription();

  currentUser$ = this.store.pipe(select(getAuthenticatedUser));

  constructor(
    private router: Router,
    private store: Store,
    private userService: UserService
  ) {
    this.subscriptions.add(
      this.currentUser$.subscribe({
        next: (user: any) => this.onCurrentUser(user)
      })
    );
  }

  onCurrentUser(user: User): void {
    if (this.checkPerms(user, [ PERMISSION_USER, PERMISSION_ADMIN ])) {
      this.router.navigate(['/cloud'], { replaceUrl: true });
      return;
    }

    this.router.navigate(['/login'], { replaceUrl: true });
  }

  checkPerms(user: User, permissions: any): boolean {
    return this.userService.permissionGranted({ user, permissions });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

}
