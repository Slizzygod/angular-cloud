import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AuthActionTypes, selectIsAuthenticated } from './core/stores';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
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
        },
        {
          link: 'logs',
          icon: 'receipt_long',
        }
      ]
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
        }
      ]
    }
  ];

  constructor(private store: Store) { }

}
