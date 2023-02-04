import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './core/stores';
import { ProxyComponent } from './static/components';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuardService],
    component: ProxyComponent,
    pathMatch: 'full'
  },
  {
    canActivate: [AuthGuardService],
    path: 'cloud',
    loadChildren: () => import('./components/cloud/cloud.module').then(m => m.CloudModule),
    data: {
      title: 'Мое облако',
    }
  },
  {
    canActivate: [AuthGuardService],
    path: 'joint',
    loadChildren: () => import('./components/joint/joint.module').then(m => m.JointModule),
    data: {
      title: 'Общедоступное',
    }
  },
  {
    canActivate: [AuthGuardService],
    path: 'favorites',
    loadChildren: () => import('./components/favorites/favorites.module').then(m => m.FavoritesModule),
    data: {
      title: 'Избранное',
    }
  },
  {
    canActivate: [AuthGuardService],
    path: 'upload',
    loadChildren: () => import('./components/upload/upload.module').then(m => m.UploadModule),
    data: {
      title: 'Загрузка',
    }
  },
  {
    canActivate: [AuthGuardService],
    path: 'settings',
    loadChildren: () => import('./components/settings/settings.module').then(m => m.SettingsModule),
    data: {
      title: 'Настройки',
    }
  },
  {
    canActivate: [AuthGuardService],
    path: 'users',
    loadChildren: () => import('./components/users/users.module').then(m => m.UsersModule),
    data: {
      title: 'Управление пользователеями',
    }
  },
  {
    canActivate: [AuthGuardService],
    path: 'logs',
    loadChildren: () => import('./components/logs/logs.module').then(m => m.LogsModule),
    data: {
      title: 'Логи',
    }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
