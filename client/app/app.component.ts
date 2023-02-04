import { PERMISSION_ADMIN } from '@app/shared/constants';
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectIsAuthenticated } from './core/stores';
import { UserService } from './core/services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  isAuthenticated$: Observable<any> = this.store.select(selectIsAuthenticated);

  navigationSideMenu = [
    {
      items: [
        {
          link: 'cloud',
          icon: 'cloud',
        },
        {
          link: 'joint',
          icon: 'folder_shared',
        },
        {
          link: 'favorites',
          icon: 'star',
        },
        {
          link: 'upload',
          icon: 'cloud_upload',
        },
        {
          link: 'users',
          icon: 'group',
          permissions: [PERMISSION_ADMIN],
        },
        {
          link: 'logs',
          icon: 'receipt_long',
          permissions: [PERMISSION_ADMIN],
        },
      ],
    },
    {
      items: [
        {
          link: 'settings',
          icon: 'settings',
        },
        {
          link: 'logout',
          icon: 'logout',
        },
      ],
    },
  ];

  constructor(private store: Store, private userService: UserService) {}

  isPermittedLink(linkPermissions: string[]): boolean {
    return this.userService.permissionGranted({ permissions: linkPermissions });
  }
}
