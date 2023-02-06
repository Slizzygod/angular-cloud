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
          note: 'Мое облако'
        },
        {
          link: 'joint',
          icon: 'folder_shared',
          note: 'Доступные файлы'
        },
        {
          link: 'favorites',
          icon: 'favorite',
          note: 'Избранное'
        },
        {
          link: 'users',
          icon: 'group',
          permissions: [PERMISSION_ADMIN],
          note: 'Управление пользователями'
        },
        {
          link: 'logs',
          icon: 'receipt_long',
          permissions: [PERMISSION_ADMIN],
          note: 'Логи'
        },
      ],
    },
    {
      items: [
        {
          link: 'settings',
          icon: 'settings',
          note: 'Настройки профиля'
        },
        {
          link: 'logout',
          icon: 'logout',
          note: 'Выход'
        },
      ],
    },
  ];

  constructor(private store: Store, private userService: UserService) {}

  isPermittedLink(linkPermissions: string[]): boolean {
    return this.userService.permissionGranted({ permissions: linkPermissions });
  }
}
